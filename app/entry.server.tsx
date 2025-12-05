import { PassThrough } from 'node:stream'
import { createReadableStreamFromReadable } from '@react-router/node'
import { isbot } from 'isbot'
import { startApiMocks } from 'mocks/server'
import type { RenderToPipeableStreamOptions } from 'react-dom/server'
import { renderToPipeableStream } from 'react-dom/server'
import type { AppLoadContext, EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

// Start API mocks in development or when MOCKS is enabled
// Since we're using Nodemailer (not HTTP-based), we don't need specific handlers for email
// but we keep the MSW infrastructure for other potential API mocks
if (process.env.NODE_ENV === 'development' || process.env.MOCKS === 'true') {
	startApiMocks([]) // Empty handlers array since we're not mocking HTTP requests for email
}

export const streamTimeout = 5_000

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	_loadContext: AppLoadContext,
	// If you have middleware enabled:
	// loadContext: unstable_RouterContextProvider
) {
	// Initialize MSW if mocks=true in search params
	const url = new URL(request.url)
	if (url.searchParams.get('mocks') === 'true') {
		startApiMocks([]) // Empty handlers since we're using Nodemailer directly
	}

	return new Promise((resolve, reject) => {
		let shellRendered = false
		// biome-ignore lint/style/useConst: default
		let userAgent = request.headers.get('user-agent')

		// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
		// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
		// biome-ignore lint/style/useConst: default
		let readyOption: keyof RenderToPipeableStreamOptions =
			(userAgent && isbot(userAgent)) || routerContext.isSpaMode
				? 'onAllReady'
				: 'onShellReady'

		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={routerContext} url={request.url} />,
			{
				[readyOption]() {
					shellRendered = true
					const body = new PassThrough()
					const stream = createReadableStreamFromReadable(body)

					responseHeaders.set('Content-Type', 'text/html')

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					)

					pipe(body)
				},
				onShellError(error: unknown) {
					reject(error)
				},
				onError(error: unknown) {
					responseStatusCode = 500
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error)
					}
				},
			},
		)

		// Abort the rendering stream after the `streamTimeout` so it has time to
		// flush down the rejected boundaries
		setTimeout(abort, streamTimeout + 1000)
	})
}

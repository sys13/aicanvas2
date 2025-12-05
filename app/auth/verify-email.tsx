import { VerifyEmail } from 'maxstack-core'
import { AuthLayout } from 'maxstack-core/layouts'
import mconfig from '~/../mconfig'

export default function VerifyEmailPage() {
	return (
		<AuthLayout appName={mconfig.name}>
			<VerifyEmail />
		</AuthLayout>
	)
}

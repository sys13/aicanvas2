import { ForgotPassword } from 'maxstack-core'
import { AuthLayout } from 'maxstack-core/layouts'
import mconfig from '~/../mconfig'

export default function ForgotPasswordPage() {
	return (
		<AuthLayout appName={mconfig.name}>
			<ForgotPassword />
		</AuthLayout>
	)
}

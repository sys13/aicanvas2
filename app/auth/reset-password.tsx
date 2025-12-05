import { ResetPassword } from 'maxstack-core'
import { AuthLayout } from 'maxstack-core/layouts'
import mconfig from '~/../mconfig'

export default function ResetPasswordPage() {
	return (
		<AuthLayout appName={mconfig.name}>
			<ResetPassword />
		</AuthLayout>
	)
}

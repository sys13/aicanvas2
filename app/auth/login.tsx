import { Login } from 'maxstack-core'
import { AuthLayout } from 'maxstack-core/layouts'
import mconfig from '~/../mconfig'

export default function LoginPage() {
	return (
		<AuthLayout appName={mconfig.name}>
			<Login />
		</AuthLayout>
	)
}

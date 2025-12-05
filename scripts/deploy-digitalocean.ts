/**
 * deploy-digitalocean.ts
 *
 * Automates creation of a secure DigitalOcean droplet and deployment
 * of a Docker container image. Focuses on reasonable hardening and
 * maintenance best‑practices for small production services.
 *
 * Dependencies (install with pnpm):
 *   pnpm add digitalocean node-ssh dotenv
 *
 * Usage:
 *   1. Create a .env file with the variables below.
 *   2. pnpm run deploy:digitalocean
 *
 * Required .env variables:
 *   DO_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Personal access token (write scope)
 *   SSH_PRIVATE_KEY_PATH=/Users/username/.ssh/id_rsa           # Path to private key for root@ server
 *   SSH_PUBLIC_KEY_ID=123456                                   # Numeric key ID already uploaded to DO
 *   DOCKER_REGISTRY=your-registry                              # Docker registry (e.g., your-dockerhub-username)
 *   DOCKER_IMAGE_TAG=latest                                    # Docker image tag
 *
 * Optional (.env overrides shown with defaults):
 *   DROPLET_NAME=maxstack-app
 *   DO_REGION=nyc3
 *   DO_SIZE=s-1vcpu-1gb
 *   DO_IMAGE=ubuntu-22-04-x64
 *   HOST_PORT=80                                               # Exposed on droplet
 *   CONTAINER_PORT=3000                                        # Container internal port
 */

import 'dotenv/config'
import * as fs from 'node:fs'
import * as path from 'node:path'
// @ts-expect-error - digitalocean module doesn't have types
import digitalocean from 'digitalocean'
import { NodeSSH } from 'node-ssh'

const {
	DO_TOKEN,
	SSH_PRIVATE_KEY_PATH,
	SSH_PUBLIC_KEY_ID,
	DOCKER_REGISTRY,
	DOCKER_IMAGE_TAG = 'latest',
	DROPLET_NAME = 'maxstack-app',
	DO_REGION = 'nyc3',
	DO_SIZE = 's-1vcpu-1gb',
	DO_IMAGE = 'ubuntu-22-04-x64',
	CONTAINER_PORT = '3000',
	HOST_PORT = '80',
} = process.env

if (
	!DO_TOKEN ||
	!SSH_PRIVATE_KEY_PATH ||
	!SSH_PUBLIC_KEY_ID ||
	!DOCKER_REGISTRY
) {
	console.error(
		'Missing required env vars. Check the script header for details.',
	)
	console.error(
		'Required: DO_TOKEN, SSH_PRIVATE_KEY_PATH, SSH_PUBLIC_KEY_ID, DOCKER_REGISTRY',
	)
	process.exit(1)
}

const CONTAINER_IMAGE = `${DOCKER_REGISTRY}/maxstack-app:${DOCKER_IMAGE_TAG}`

async function wait(ms: number) {
	return new Promise((res) => setTimeout(res, ms))
}

async function main() {
	const client = digitalocean.client(DO_TOKEN)

	console.log('➤ Creating droplet …')
	const droplet = await client.droplets.create({
		name: DROPLET_NAME,
		region: DO_REGION,
		size: DO_SIZE,
		image: DO_IMAGE,
		ssh_keys: [Number(SSH_PUBLIC_KEY_ID)],
		tags: ['maxstack-app', 'managed-by-script'],
	})

	const dropletId = droplet.id
	console.log(`   Droplet #${dropletId} created; waiting for ACTIVE …`)

	let ip: string | undefined
	for (;;) {
		await wait(10_000)
		const meta = await client.droplets.get(dropletId)
		if (meta.status === 'active') {
			// biome-ignore lint/suspicious/noExplicitAny: Type is dynamic
			ip = meta.networks.v4.find((n: any) => n.type === 'public')?.ip_address
			if (ip) break
		}
		process.stdout.write('.')
	}
	console.log(`\n   Droplet active at ${ip}`)

	if (!ip) {
		console.error('Failed to get droplet IP address')
		process.exit(1)
	}

	// ────────────────────────────────────────────────────────────────
	// SSH hardening + Docker deploy
	// ────────────────────────────────────────────────────────────────
	const ssh = new NodeSSH()
	console.log('➤ Connecting via SSH …')

	// Wait a bit for SSH to be ready
	await wait(30_000)

	try {
		await ssh.connect({
			host: ip,
			username: 'root',
			privateKey: fs.readFileSync(
				path.resolve(SSH_PRIVATE_KEY_PATH as string),
				'utf8',
			),
			readyTimeout: 30000,
		})
	} catch (error) {
		console.error(
			'Failed to connect via SSH. The droplet might still be initializing.',
		)
		console.error('Wait a few minutes and try connecting manually with:')
		console.error(`ssh root@${ip}`)
		throw error
	}

	console.log('➤ Provisioning droplet …')
	const script = `set -eux

export DEBIAN_FRONTEND=noninteractive

# Update system packages
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
  ufw fail2ban unattended-upgrades docker.io curl

# SSH hardening — disable passwords
sed -ri 's/^#?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload sshd

# Unattended upgrades
systemctl enable --now unattended-upgrades

# UFW firewall rules
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Fail2Ban — accept defaults
systemctl enable --now fail2ban

# Docker service
systemctl enable --now docker

# Pull and run the container
echo "Pulling Docker image: ${CONTAINER_IMAGE}"
docker pull ${CONTAINER_IMAGE}

# Stop any existing container
docker stop maxstack-app || true
docker rm maxstack-app || true

# Run the new container
docker run -d \
  --name maxstack-app \
  --restart unless-stopped \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  ${CONTAINER_IMAGE}

printf '\n✅ Deployment complete!\n'
printf 'Container status:\n'
docker ps | grep maxstack-app || echo "Container not running - check logs with: docker logs maxstack-app"
printf '\nView logs with: docker logs maxstack-app\n'`

	const { stdout, stderr } = await ssh.execCommand(script, {
		execOptions: { pty: true },
	})
	if (stdout) console.log(stdout)
	if (stderr) console.error(stderr)

	ssh.dispose()
	console.log(`🎉 All done → http://${ip}`)
	console.log(`\nUseful commands for managing your droplet:`)
	console.log(`SSH: ssh root@${ip}`)
	console.log(`Check logs: ssh root@${ip} "docker logs maxstack-app"`)
	console.log(
		`Update app: ssh root@${ip} "docker pull ${CONTAINER_IMAGE} && docker stop maxstack-app && docker rm maxstack-app && docker run -d --name maxstack-app --restart unless-stopped -p ${HOST_PORT}:${CONTAINER_PORT} ${CONTAINER_IMAGE}"`,
	)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})

# Deploy to a DigitalOcean droplet

`.github/workflows/deploy.yml` deploys every push to `main`. It runs the existing
JavaScript checks, prepares the contents of `public/`, and uploads them with rsync
over SSH. You can also run it from GitHub's Actions tab using Run workflow on main.
This publishes the website; it does not create a GitHub Release or version tag.

## Prepare the droplet

Use the directory your web server already serves, such as
`/var/www/dev-website`. The SSH deployment user must be able to write to it, and
the web server must be able to read it. The workflow assumes the web server is
already configured and the directory exists. It does not install or restart it.

Install rsync on the droplet if needed (Ubuntu/Debian):

```sh
sudo apt-get update
sudo apt-get install -y rsync
```

Create a dedicated SSH key on your computer, using an unused filename:

```sh
ssh-keygen -t ed25519 -C "github-actions-dev-website" -f ~/.ssh/dev-website-deploy -N ""
```

Append the contents of `~/.ssh/dev-website-deploy.pub` to the deployment user's
`~/.ssh/authorized_keys` on the droplet. Keep that user's `.ssh` directory at
mode 700 and `authorized_keys` at mode 600. Use a dedicated non-root user with
write access to this website directory.

## Configure GitHub

In the repository, open **Settings → Secrets and variables → Actions** and add
these **repository secrets**:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | Droplet IPv4 address or hostname, without `https://`. |
| `DEPLOY_USER` | SSH deployment username. |
| `DEPLOY_PATH` | Absolute directory served by the web server, for example `/var/www/dev-website`. No spaces. |
| `DEPLOY_SSH_KEY` | Entire private key from `~/.ssh/dev-website-deploy`, including BEGIN/END lines. |
| `DEPLOY_KNOWN_HOSTS` | Verified SSH host-key entry for the droplet, as described below. |

Keep the private key out of the repository and chat. Its public counterpart
belongs in the droplet's `authorized_keys`, not GitHub's repository Deploy keys.

For `DEPLOY_KNOWN_HOSTS`, obtain the droplet's host public key through the
DigitalOcean console or an already trusted SSH connection:

```sh
cat /etc/ssh/ssh_host_ed25519_key.pub
```

Prefix the key type and key data with exactly the host used in `DEPLOY_HOST`:

```text
YOUR_DROPLET_HOST ssh-ed25519 YOUR_DROPLET_HOST_PUBLIC_KEY
```

SSH defaults to port 22. For another port, add a repository **variable** named
`DEPLOY_PORT`, and use `[YOUR_DROPLET_HOST]:PORT` as the host field in the
known-hosts entry. The droplet firewall must permit the runner's SSH connection.

## Files uploaded

All files and subdirectories inside `public/` are copied automatically. The
current structure includes:

- `index.html`
- `css/` and `js/`
- `assets/images/`, `assets/videos/`, and `assets/documents/`

The contents go directly into `DEPLOY_PATH`, not a nested `public/` directory.
Keep the droplet's existing web root and `DEPLOY_PATH` unchanged when migrating
from the old flat repository layout.

The entire `design/` directory (including adaptive mocks), tests, documentation,
Git metadata, and workflow files stay outside `public/` and are not deployed.
`.DS_Store` is also excluded. Put new runtime assets inside `public/assets/`;
they will be included automatically. Everything in `public/` is intended to be
publicly accessible, so keep development files and credentials outside it.

Deployment mirrors `public/`: new files are added, changed files are updated,
and remote files absent from `public/` are deleted at the end of the transfer.
Renamed files are handled as an addition and a deletion. Checksums detect content
changes even when a file's size and modification time are unchanged.

`DEPLOY_PATH` must be a directory dedicated to this website. Do not store uploads,
server configuration, or other independently maintained files there: they would
be deleted. This also removes files left over from the old flat website layout
and any previously uploaded design mockups on the next deployment.

The workflow requires a nonempty `public/index.html` before preparing an upload.
Transfers delay replacement and deletion until the end, but are not an atomic
whole-site release. A full redesign needs no upload-list changes; keep the
website in `public/` and update its tests alongside any behavior changes.

## Enable and check deployment

After the droplet and secrets are configured, commit and push the workflow to
`main`. Open **Actions → Deploy website** to see the test and upload results,
then open your website to verify the update. Future pushes deploy automatically.

No DigitalOcean API token is required: this workflow connects directly over SSH.

References: [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
and [DigitalOcean SSH connections](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/).

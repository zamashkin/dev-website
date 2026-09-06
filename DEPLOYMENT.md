# Deploy to a DigitalOcean droplet

`.github/workflows/deploy.yml` deploys every push to `main`. It runs the existing
JavaScript checks, prepares the eight website files, and uploads them with rsync
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

Only these files are copied:

- `index.html`, `styles.css`, and `script.js`
- `favicon.svg` and `link-preview.png`
- `my-face-ascii-optimized.webm` and `my-face-poster-optimized.webp`
- `Aleksandr_Zamashkin_Frontend.pdf`

The entire `design/` directory (including adaptive mocks), tests, documentation,
Git metadata, and workflow files are excluded by this explicit file list. Add
new website assets to the workflow's Prepare website files step when needed.

Existing remote files are preserved. If old design files are already on the
droplet, remove those separately after confirming their location. Transfers
delay replacement until the end, but are not an atomic whole-site release.

## Enable and check deployment

After the droplet and secrets are configured, commit and push the workflow to
`main`. Open **Actions → Deploy website** to see the test and upload results,
then open your website to verify the update. Future pushes deploy automatically.

No DigitalOcean API token is required: this workflow connects directly over SSH.

References: [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
and [DigitalOcean SSH connections](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/).

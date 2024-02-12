# How To Create a Remote SSH Gateway to a Local OpenBSD Server

Hosting a server on your local network can provide many advantages, such as
access to the physical hardware and easy interaction with other devices on the
network. However, by default you will not be able to access it from outside that
network.

I recently set up a OpenBSD server on a Thinkpad T60, and I have multiple users
connecting to it for development as well as recreational use (I have installed
a few CLI games for fun). It is hosted on my university's network, so users can
connect to it locally from anywhere on campus. I also wanted to be able to
access it remotely as well through the internet. To achieve this, I set up a
reverse SSH tunnel on the Thinkpad using `autossh`, and I have it running as a
daemon now.

In order to do this, first you must first have a server connected to the
internet (I am using a Vultr VPS instance running Debian 11). It is fairly
straightforward from there.

## Step 1: Modify the remote server's sshd configuration

Add the following lines to your sshd config (on my machine it is in
`/etc/ssh/sshd_config`:
```
AllowTcpForwarding yes
GatewayPorts yes
```

## Step 2: Add a user on the remote server for tunnelling

Now, it is necessary to add a user on the remote server for the local one to
connect to, and generate a SSH key for the new user.

```
# add the user
useradd -m sshfwd

# generate a ssh key for the user
su sshfwd
ssh-keygen
```

Afterwards, copy the public key in your local machine (it should be in `~/.ssh/id_rsa.pub`)
to your remote server and add it to `/home/sshfwd/.ssh/authorized_keys` (you can just copy
it to that file since it will not even exist for a new user).

## Step 3: Open a port for the tunnel

I am using `ufw` as a firewall on my remote server, and I highly recommend it.
On Debian using `ufw`, the following should open a port for your ssh tunnel. You
can pick any unused port.

```
ufw allow PORT
service ufw restart
```

## Step 4: Create autossh tunnel daemon on the local server

This is probably the most involved part. I wrote a one line script called
`sshtund`, and put it in `/usr/local/bin`. `autossh` is not installed on OpenBSD
7.2 by default, so it is necessary to install it by running `pkg_add autossh`.

Here is the autossh command:
```
#!/bin/sh
autossh -M 0 -o "ExitOnForwardFailure yes" -o "ServerAliveInterval 30" \
	-o "ServerAliveCountMax 3" -o "TCPKeepAlive yes" -N -v \
	-R PORT:localhost:22 sshfwd@REMOTE_IP &
```

`autossh` ensures that the tunnel doesn't go down, as it will attempt to
reconnect if the connection is lost.

## Step 5: Create and start the daemon

Create a rc file for the tunnel on the local machine at `/etc/rc.d/sshtund`:

```
#!/bin/ksh

daemon="/usr/local/bin/sshtund"

. /etc/rc.d/rc.subr

pexp="sshtund: ${daemon}${daemon_flags:+ ${daemon_flags}} \[listener\].*"

rc_configtest() {
        ${daemon} ${daemon_flags} -t
}

rc_cmd $1
```

Then run `rcctl start sshtund` to start the tunnel. You should now be able to
connect to your local server anywhere via `ssh -p PORT user@REMOTE_IP`, using
the username on your local server.

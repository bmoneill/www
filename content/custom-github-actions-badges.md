---
title: "How To Create Custom Github README Badges Using GitHub Actions"
description: "A tutorial on how to create custom GitHub README badges for code coverage, test results, and more"
date: 2026-03-09T15:23:11-04:00
draft: false
---

GitHub Actions is a great tool for automating workflows. A common use case is
creating custom badges that display on your GitHub repository's README. Actions
has support for a basic pass/fail status badge for each workflow run, but it is
also possible to create custom badges which show more detailed information, such
as code coverage percentages. The method I used to employ this only requires paying
for a web server.

## Getting Started

You must have an existing workflow which produces the data you
want to display in your badge. In this tutorial, I will assume that you
are using GitHub Actions to generate code coverage reports for tests in a C project,
and you have a web server using Nginx. See [this example workflow](https://github.com/bmoneill/libc8/blob/main/.github/workflows/cmake-single-platform.yml)
for reference.

## Building the Workflow

First, you will need to update your workflow so that it can send the badge data
to your web server. To do this, you need to set a Step ID for the step that
generates the badge data. This will be used to reference the output in a
subsequent step. For example:

```yaml
- name: Generate coverage data
  id: coverage
  run: |
    # Get the raw coverage output
    raw="$(ctest --test-dir ${{github.workspace}}/build -T coverage)"

    # Process the output and store it in the step's GITHUB_OUTPUT environment variable
    echo "percentage=$(echo "$raw" | tail -n 1 | sed 's/.*: //' | sed 's/\..*//')" >> "$GITHUB_OUTPUT"
    ...
```

Then, you can use the `steps` context to access the output of the step and
call a script on your web server to update the badge.

```yaml
- name: Update coverage badge
  if: github.ref == 'refs/heads/main' # Only update on main branch
  uses: appleboy/ssh-action@master
  with:
    host: yourdomain.com
    username: www
    key: ${{ secrets.wwwssh }}
    passphrase: ${{ secrets.wwwpass }}
    port: 22
    script: |
      update-coverage PROJECTNAME ${{ steps.coverage.outputs.percentage }}
```

This step will log into your web server via SSH and call the `update-coverage`
script to update the badge. You will have to generate a SSH key, add it to
your web server's authorized keys, and add it to your GitHub repository's
secrets so that GitHub Actions can connect.

## Server Configuration

On the server side, you will need to update your Nginx configuration to
return a 301 to a [shields.io](http://shields.io/) badge URL.

```bash
# /etc/nginx/includes/PROJECTNAME.conf
location /badge/PROJECTNAME {
    return 301 https://img.shields.io/badge/coverage-XX%-orange.svg;
}
```

Then, add this line to your Nginx site configuration:

```bash
# /etc/nginx/sites-enabled/yourdomain
...
include includes/PROJECTNAME.conf;
...
```

After you reload your Nginx configuration, the badge should be visible at
`https://yourdomain.com/badge/PROJECTNAME`. Now, we have to write a script that
updates the badge percentage automatically:

```bash
#!/bin/bash
# /usr/local/bin/update-coverage
# Usage: $0 reponame percentage

# Validate input
if  ! [[ "$1" =~ ^[a-zA-Z0-9-]+$ ]]; then
    echo "Invalid repository name: $1" >&2
    exit 1
fi
if ! [[ "$2" =~ ^[0-9]+$ ]]; then
    echo "Invalid percentage: $2" >&2
    exit 1
fi

# Update badge percentage in Nginx config
sed "s/coverage-../coverage-$2/" /etc/nginx/includes/$1.conf > tmp.conf
mv -f tmp.conf /etc/nginx/includes/$1.conf

# Reload Nginx
nginx -t # Make sure configuration is valid before reloading
[ "$?" -eq 0 ] && systemctl reload nginx


# Purge cached badge from GitHub
# See https://dev.to/jcubic/github-action-to-clear-cache-on-images-in-readme-5g1n
curl -s https://github.com/YOURUSERNAME/$1/blob/main/README.md > tmp.md
grep -Eo '<img src=\\"[^"]+\\"' tmp.md | grep camo | grep -Eo 'https[^"\\]+' | xargs -I {} curl -w "\n" -s -X PURGE {}
rm tmp.md
```

Hopefully you are not SSHing into your server as root, so we need to update
`/etc/sudoers` to allow the non-root user that will be running this script
to execute it as root without entering a password:

```bash
www ALL=(root) NOPASSWD: /usr/local/bin/update-coverage
```

Finally, update your README.md file to include the badge:

```markdown
...
[![Coverage](https://yourdomain.com/badge/PROJECTNAME)](https://github.com/YOURUSERNAME/PROJECTNAME)
...
```

Now, you should be all set! When you push a new commit to your repository's
`main` branch, assuming that your workflow executed successfuly, the badge
percentage should update automatically.

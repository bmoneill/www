# How To Filter Emails Using Notmuch's Virtual Mailboxes

Notmuch is a very powerful tool for managing email, and I had an issue
I have been dealing with for a little while now that I realized I
could use Notmuch for, so I will go through the process I took to
solve it in this article. I get loads of emails from colleges, and I
wanted to separate those emails from everything else. Now, I&rsquo;ve heard
Gmail has this feature, but since I don&rsquo;t use Gmail on my primary
email address (unfortunately I have a Gmail account for school), I
decided to figure out how to separate emails from colleges into their
own mailbox in my mail client, Neomutt.

First off, when syncing mail, it should automatically tag new mail
if it matches given queries, like in my case the words &ldquo;college&rdquo; and
&ldquo;university&rdquo;. I have a script that downloads new mail every five
minutes in a cronjob, so I added this:

	# ~/.local/bin/mailsync
	...
	notmuch new # update notmuch db
	notmuch tag +college "university" and in folder:xyz/INBOX
	notmuch tag +college "college" and in folder:xyz/INBOX

Now every time mail is synced, it will be tagged appropriately. If you
wanted to perform a Notmuch query for all mail that does not contain
those phrases, you could type the following:

	$ notmuch search not tag:college

This query can also be used in Neomutt by using virtual mailboxes like so:

	# ~/.config/mutt/muttrc
	...
	set nm_default_uri="notmuch:///home/ben/.local/share/mail" # replace with your mail dir
	set virtual_spoolfile=yes
	virtual-mailboxes \
	    "Inbox" "notmuch://?query=folder:xyz/INBOX and not tag:college and not tag:spam"\
	    "College" "notmuch://?query=folder:xyz/INBOX and tag:college"\
	    "Sent" "notmuch://?query=folder:xyz/Sent"\
	    ...

This is a super helpful thing for me and it was an interesting
learning experience setting this up. I hope this can be helpful to
somebody. Thanks for reading!

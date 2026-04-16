---
title: "How To Fix Arch Linux After Windows Breaks It"
description: "A tutorial on how to fix your Arch installation after Windows renders it unbootable"
date: 2026-04-16T10:23:11-04:00
draft: false
---

If you dual boot Windows and Linux, especially if your Windows installation uses
BitLocker, you may run into situations where Windows renders your Linux installation
unbootable. If you are in a situation where you may need to boot into Windows
every once in a while, this guide will show you how to fix your Linux
installation after Windows inevitably breaks it.

This guide is mainly for Arch Linux but will likely work with other Linux distros
as well with some modifications, but I recommend using the
[Arch ISO](https://archlinux.org/download/) to repair your installation. You
should have moderate Linux knowledge before using this guide. Read the guide in
its entirety before following it.

## Notes

- **MAKE SURE YOU HAVE A SEPARATE /boot PARTITION.** Check via `df -h` on the
  Live USB.
- **RUN ALL COMMANDS FROM THIS GUIDE AT YOUR OWN RISK. I AM NOT LIABLE FOR ANY
  DAMAGE OR LOSS OF DATA.**
- This guide assumes you are using an Arch-based distro with GRUB.

## Set Up

- First, you need a bootable USB drive with [Arch](https://archlinux.org/download/)
  on it. From Windows, you can use [Rufus](https://rufus.ie/) to flash it.
- Boot into the USB.
- Run `df -h` and locate your Linux partitions.

## Reformat Boot Partition

If you are using Arch, feel free to simply wipe your /boot partition without
backing it up, as long as you are only storing bootloader and kernel stuff in
that partition. Replace `/dev/sda1` with your boot partition's device path.

```shell
mkfs.fat -F32 /dev/sda1 # Reformat /boot partition
```

## Mount partitions

```shell
mount /dev/sda2 /mnt # Root partition
mount /dev/sda1 /mnt/boot # Boot partition
mount /dev/sda3 /mnt/home # Home partition
```

Make sure you mount **all** partitions used by your Linux installation, as we will
need the entire filesystem set up for the fstab.

## Reinstall GRUB and Linux

```shell
# Generate fstab
genfstab -U /mnt > /mnt/etc/fstab

# chroot into existing installation
arch-chroot /mnt

# Reinstall GRUB, again replace /dev/sda with your boot partition's
# device path, not partition path (e.g. NOT /dev/sda1)
grub-install --target=x86_64-efi --efi-directory=/boot /dev/sda

# Reinstall linux (and/or linux-lts), most likely no need for internet since it's
# probably cached in /var/cache/pacman
pacman -S linux linux-lts

# Remake GRUB config
grub-mkconfig -o /boot/grub/grub.cfg

# Clean up
exit
umount -R /mnt
reboot
```

Unplug the USB and you should be all set! You may need to fix the boot order in
your BIOS but your Arch installation should be bootable now.

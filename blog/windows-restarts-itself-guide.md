---
title: >-
    Fix Windows restarting after sleep or hybernate: the complete 2020 guide
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  So your computer starts on its own after you put it to sleep or even after you turn it off. Maybe it does so immediately or maybe it waits for a few minites or hours. But you feel like you can't trust it anymore. Here are all the things you can turn off.
date: '2020-10-25'
thumb_image: images/nighttimeupdates_thumb.jpg
image: images/nighttimeupdates.jpg
layout: post
---

So your computer starts on its own after you put it to sleep or even after you turn it off. Maybe it does so immediately or maybe it waits for a few minutes or hours. But you feel like you can't trust it anymore: there's few things more unsettling than being woken up by the bright light of your screen in the middle of the night. Well here is my comprehensive list of things to check (and to turn off!) to prevent this from happening again.

**First off, open an admin Powershell terminal.** You can do so by right-clicking the start menu button and selecting `Windows PowerShell (Admin)`

## 1: Check why the system restarted

The first thing to do when diagnosing the problem is to use the `powercfg /lastwake` command to find out what prompted the system to restart.
If a hardware device was responsible for restarting windows, you should see it here.

Sometimes, however, things are more nebulous and you get something like:

```
❯ powercfg /lastwake
Wake History Count - 1
Wake History [0]
  Wake Source Count - 0
```

In this case, follow the next steps to make double sure that nothing can wake up your pc.

## 2: Disable wake timers

This is fairly straightforward and should really be all you need. 

 - Open the Start menu and type `Edit power plan`
 - Choose `Change advanced power settings`
 - Navigate to `Sleep` -> `Allow wake timers` and select `Disable`
 - Press OK and close

![Power options dialog, disable windows wake timers](/images/poweroptions.png)

_In theory_, the above steps should be enough to stop any device from waking up your computer. In practice, you'll probably have to explicitly disable more stuff:

## 3: Disable any peripherals that can wake up your computer

The main peripherals to take into account here are keyboards, mice and network adapters. The network adapter can be set to wake up your computer whenever it receives any data (a very bad idea!) or when it receives a special "wake up" packet.

You can check which devices can wake up your pc with the command: `powercfg /devicequery wake_armed`. You'll see something like:

```
❯ powercfg /devicequery wake_armed
HID-compliant mouse (006)
HID Keyboard Device (006)
```

Now comes the fun part. Open the Device manager by right-clicking the Windows button and selecting `Device Manager` and, one by one, open the property pages for the devices listed above. In the `Power management` tab, you'll find a flag that you want to disable: `Allow this device to wake the computer`. Do so for each device. For your network card, you can optionally set it so that only a "magic packet" can wake up the computer. If you don't know what a magic packet is, it's safe to disable it 😅

![Power options for a keyboard in Windows device manager](/images/badkeyboard.png)

## 4: Find out if any scheduled tasks are waking up your computer

If the above steps didn't work, it's time to bring out the big guns. And by big guns I mean this powershell command: `Get-ScheduledTask | where {$_.settings.waketorun}`. It will list all the scheduled tasks that are allowed to wake up your computer in order to perform some maintenance, or more likely to install updates:

```
❯ Get-ScheduledTask | where {$_.settings.waketorun}

TaskPath                                       TaskName                          State
--------                                       --------                          -----
\Microsoft\Windows\.NET Framework\             .NET Framework NGEN v4.0.30319... Disabled
\Microsoft\Windows\.NET Framework\             .NET Framework NGEN v4.0.30319... Disabled
\Microsoft\Windows\InstallService\             WakeUpAndContinueUpdates          Disabled
\Microsoft\Windows\InstallService\             WakeUpAndScanForUpdates           Disabled
\Microsoft\Windows\SharedPC\                   Account Cleanup                   Disabled
\Microsoft\Windows\UpdateAssistant\            UpdateAssistantWakeupRun          Disabled
\Microsoft\Windows\UpdateOrchestrator\         Backup Scan                       Ready
\Microsoft\Windows\UpdateOrchestrator\         Reboot                            Ready
\Microsoft\Windows\UpdateOrchestrator\         Reboot_AC                         Disabled
\Microsoft\Windows\UpdateOrchestrator\         Universal Orchestrator Start      Ready
```

In my case, the "Backup Scan" task above was the culprit, so I disabled it. You could disable it by opening the Windows task scheduler, but sometimes the UI won't allow you to disable one of the "system" scheduled tasks like the ones related to Windows Update. But a simple powershell command can take care of it:

```
❯ Disable-ScheduledTask  "\Microsoft\Windows\UpdateOrchestrator\Backup Scan"
```

Check again with the previous command, and it will be disabled:

```
❯ Get-ScheduledTask | where {$_.settings.waketorun}

TaskPath                                       TaskName                          State
--------                                       --------                          -----
\Microsoft\Windows\.NET Framework\             .NET Framework NGEN v4.0.30319... Disabled
\Microsoft\Windows\.NET Framework\             .NET Framework NGEN v4.0.30319... Disabled
\Microsoft\Windows\InstallService\             WakeUpAndContinueUpdates          Disabled
\Microsoft\Windows\InstallService\             WakeUpAndScanForUpdates           Disabled
\Microsoft\Windows\SharedPC\                   Account Cleanup                   Disabled
\Microsoft\Windows\UpdateAssistant\            UpdateAssistantWakeupRun          Disabled
\Microsoft\Windows\UpdateOrchestrator\         Backup Scan                       Disabled
\Microsoft\Windows\UpdateOrchestrator\         Reboot                            Ready
\Microsoft\Windows\UpdateOrchestrator\         Reboot_AC                         Disabled
\Microsoft\Windows\UpdateOrchestrator\         Universal Orchestrator Start      Ready
```

Now hopefully you can set your device to sleep mode and have some well deserved, uninterrupted sleep yourself! 😁

---

<small>_The feature image above was taken by [Clint Patterson](https://unsplash.com/@cbpsc1)_</small>
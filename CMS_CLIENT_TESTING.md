# ACE SELECT CMS client test checklist

Use this checklist after applying the three Supabase migrations and signing in
at `/admin/login`.

## Page content editor

- [ ] Open **Admin → Page Content** and switch between Home, Who We Are,
      Services, Industries, Projects, and Contact.
- [ ] Confirm the green **Cloud CMS connected** status is visible. If it says
      **Local fallback cache**, stop testing production persistence and repair
      the Supabase environment first.
- [ ] Change one text field, switch between Desktop, Tablet, and Mobile
      preview, and confirm the draft preview updates before saving.
- [ ] Click **Save All**, reload the page, and confirm the changed text remains.
- [ ] Open the public page in a new tab and confirm the changed text is live.
- [ ] Upload an image and a video, confirm each preview, save, reload, and
      confirm the media appears on the public page.
- [ ] Toggle a field to **Hidden**, save, and confirm the related public
      override is no longer active.
- [ ] Add a new field, save it, then remove it and save again.
- [ ] Try an invalid URL or duplicate content key and confirm the editor shows
      a clear error without losing previously saved content.
- [ ] Use the editor on a phone-sized viewport. Confirm there is no horizontal
      page overflow and the sticky Save button remains usable.

## Public website smoke test

- [ ] Home page loads on desktop and mobile.
- [ ] Who We Are, Services, Industries, Projects, and Contact load without a
      console error or broken hero media.
- [ ] Main navigation opens and closes on mobile; body scrolling returns after
      closing the menu.
- [ ] Contact form submits a test enquiry and the admin enquiry list receives
      it.
- [ ] Uploaded images have useful alt text and videos play on supported
      browsers.

## Release evidence

Run before client handoff:

```bash
npm test
npm run build
```

Record the deployment URL, test date, browser/device used, and any failed item
before approving the release.

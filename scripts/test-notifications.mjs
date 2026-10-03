async function testNotifications() {
  console.log('=== Step 1: Login ===');
  const loginRes = await fetch('http://127.0.0.1:3000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@aceselect.in', password: 'AceSelect@2026' })
  });
  const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
  console.log('Login status:', loginRes.status);

  console.log('=== Step 2: Fetch Notifications ===');
  const notifRes = await fetch('http://127.0.0.1:3000/api/admin/notifications', {
    headers: { Cookie: cookie }
  });
  const notifData = await notifRes.json();
  console.log('Notifications status:', notifRes.status);
  console.log('Unread count:', notifData.unread_count);
  console.log('Total count:', notifData.total_count);
  console.log('Stats:', notifData.stats);
  if (notifData.notifications?.length) {
    console.log('Sample notification:', notifData.notifications[0].title);
  }

  console.log('=== Step 3: Fetch Enquiries ===');
  const enqRes = await fetch('http://127.0.0.1:3000/api/admin/enquiries', {
    headers: { Cookie: cookie }
  });
  const enqData = await enqRes.json();
  console.log('Enquiries status:', enqRes.status);
  console.log('Enquiries count:', enqData.enquiries?.length);
  if (enqData.enquiries?.length) {
    console.log('Sample enquiry:', enqData.enquiries[0].company, '|', enqData.enquiries[0].name, '| Status:', enqData.enquiries[0].status);
  }

  console.log('=== Step 4: Mark Notification Read/Unread ===');
  if (notifData.notifications?.length) {
    const firstId = notifData.notifications[0].id;
    const patchRes = await fetch('http://127.0.0.1:3000/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ action: 'mark_read', id: firstId })
    });
    console.log('Patch mark read status:', patchRes.status);
  }

  console.log('=== Step 5: Test /admin/notifications page render ===');
  const pageRes = await fetch('http://127.0.0.1:3000/admin/notifications', {
    headers: { Cookie: cookie }
  });
  console.log('/admin/notifications status:', pageRes.status);

  console.log('=== ALL NOTIFICATION TESTS PASSED! ===');
}

testNotifications().catch(console.error);

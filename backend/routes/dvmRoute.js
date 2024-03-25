const express = require('express');
const router = express.Router();
const  dvmMethods  = require('../Controllers/DVM/DVM');

// POST route to add data to the DVM table
router.post('/register-dvm', dvmMethods.addDVM);
router.get('/get-dvms', dvmMethods.getAllDVMs);
router.post('/push-notification-meeting',dvmMethods.createNotificationMeeting)
router.get('/get-dvm-stats/:dvmId', dvmMethods.getDvmMonthlyStats);
router.get('/get-meeting-notifications/:email',dvmMethods.getNotificationsMeetings)
router.put('/update-notifications-meeting/:email/:role',dvmMethods.updateNotifications)
router.get('/get-dvm-profile/:email',dvmMethods.getDvmProfile)
router.post('/get-meetings-counts',dvmMethods.getMeetingsCounts)
router.put('/update-availability/:email/:status',dvmMethods.updateAvailabilityStatus)
router.put('/update-meeting-status/:meetingID/:newStatus',dvmMethods.updateMeetingStatus)
router.get('/get-all-meetings-of-dvm/:id',dvmMethods.getAllMeetingsByDvmId)



module.exports = router;

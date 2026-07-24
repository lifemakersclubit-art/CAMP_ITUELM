/**
 * وحدة المساعدات والدوال العامة
 * Utils.gs
 */

var MAIN_SHEET_ID = '1V-U6PRLJ5mYH5KC2wm0A7HaEIiAvqtFl8ddTKkVTFWA';
var APPLICANTS_SHEET_ID = '1QhtcTQZ0jj6pYrrdsN0tghfN7mpebXUxy5t_qEDO8Io';
var APPLICANTS_TAB_NAME = 'FULL DATA';
var APPLICANTS_ID_COLUMN = 11; // العمود K (index 11)

/**
 * إنشاء استجابة JSON
 */
function jsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * إنشاء قفل لمنع تضارب الكتابة
 */
function createLock() {
  return LockService.getScriptLock();
}

/**
 * تأمين القفل
 */
function acquireLock() {
  var lock = createLock();
  var acquired = lock.tryLock(5000);
  if (!acquired) {
    throw new Error('الخدمة مشغولة حالياً، يرجى المحاولة مرة أخرى.');
  }
  return lock;
}

/**
 * تحرير القفل
 */
function releaseLock(lock) {
  if (lock) {
    lock.releaseLock();
  }
}

/**
 * إرسال بريد ترحيب
 */
function sendWelcomeEmail(data) {
  var subject = 'تأكيد التسجيل - برنامج مدار | كامب جذور';
  
  var body = 'السيدة / السيد ' + data.fullName + '\n\n';
  body += 'السلام عليكم ورحمة الله وبركاته،\n\n';
  body += 'يسعدنا إبلاغكم بأنه قد تم استلام طلبكم بنجاح للتسجيل في برنامج مدار | كامب جذور.\n\n';
  body += 'فيما يلي ملخص بياناتكم:\n';
  body += '———————————————————\n';
  body += 'الاسم: ' + data.fullName + '\n';
  body += 'الرقم القومي: ' + data.nationalId + '\n';
  body += 'رقم الهاتف: ' + data.phone + '\n';
  body += 'البريد الإلكتروني: ' + data.email + '\n';
  body += 'الجامعة: ' + data.university + '\n';
  body += 'المحافظة: ' + data.governorate + '\n';
  body += '———————————————————\n\n';
  body += 'سيتم مراجعة طلبكم والرد عليكم خلال الفترة المقبلة.\n\n';
  body += 'نتطلع للقائكم.\n\n';
  body += 'مع خالص التقدير والاحترام،\n';
  body += 'فريق برنامج مدار | كامب جذور\n';
  body += 'رابطة أسر صناع الحياة بالجامعات المصرية\n';
  body += '———————————————————\n';
  body += 'لل التواصل معنا: rwaq@lifemakers.org';
  
  try {
    GmailApp.sendEmail(data.email, subject, body, {
      name: 'كاب جذور - رابطة أسر صناع الحياة بالجامعات المصرية'
    });
    Logger.log('تم إرسال البريد الترحيبي إلى: ' + data.email);
    return true;
  } catch (e) {
    Logger.log('خطأ في إرسال البريد: ' + e.toString());
    return false;
  }
}

/**
 * تسجيل الحدث
 */
function logEvent(action, details) {
  Logger.log('[' + new Date().toISOString() + '] ' + action + ': ' + JSON.stringify(details));
}

/**
 * تنظيف строкة
 */
function sanitizeString(str) {
  if (!str) return '';
  return String(str).trim().replace(/\s+/g, ' ');
}

/**
 * تحويل قيمة boolean من نص
 */
function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    return val.toLowerCase() === 'true' || val === 'نعم' || val === '1';
  }
  return false;
}

/**
 * ============================================================
 * نظام تسجيل برنامج مدار | كامب جذور
 * رابطة أسر صناع الحياة بالجامعات المصرية
 * 
 * ملف واحد مدمج - انسخه في Code.gs واحد فقط
 * ============================================================
 */

// ═══════════════════════════════════════════
// الإعدادات العامة
// ═══════════════════════════════════════════

var MAIN_SHEET_ID = '1V-U6PRLJ5mYH5KC2wm0A7HaEIiAvqtFl8ddTKkVTFWA';
var APPLICANTS_SHEET_ID = '1QhtcTQZ0jj6pYrrdsN0tghfN7mpebXUxy5t_qEDO8Io';
var APPLICANTS_TAB_NAME = 'FULL DATA';
var APPLICANTS_ID_COLUMNS = [11, 12]; // العمود K و L
var REG_TAB_NAME = 'REG'; // تاب إضافي، البيانات في العمود الأول (A)
var JADB_TAB_NAME = 'جذب'; // تاب إضافي، الأرقام القومية في العمود الأول (A)

// ═══════════════════════════════════════════
// البيانات الافتراضية للجان والمهارات
// ═══════════════════════════════════════════

var DEFAULT_COMMITTEES = [
  'IT',
  'HR',
  'PR',
  'ميديا',
  'تنمية وتدريب',
  'تواصل ودعم',
  'جذب واستقبال',
  'فريق مركزي',
  'ملف التفعيل',
  'ملف التوسع',
  'منسقي القطاعات',
  'مسؤولي الجامعات'
];

var DEFAULT_COMMITTEE_SKILLS = {
  'IT': ['إعداد وصيانة الأنظمة', 'الدعم الفني', 'إدارة الشبكات', 'تطوير المواقع', 'أمن المعلومات'],
  'HR': ['التوظيف', 'بناء الفرق', 'إدارة الأداء', 'حل النزاعات', 'التواصل الداخلي'],
  'PR': ['العلاقات العامة', 'التواصل الخارجي', 'بناء الشراكات', 'إدارة الملفات الرسمية', 'التواصل الكتابي'],
  'ميديا': ['التصوير الفوتوغرافي', 'المونتاج', 'التصميم الجرافيكي', 'إدارة صفحات التواصل', 'البث المباشر'],
  'تنمية وتدريب': ['تصميم البرامج التدريبية', 'المحاضرة الفعالة', 'التدريب عن بُعد', 'تقييم الأداء', 'التخطيط الاستراتيجي'],
  'تواصل ودعم': ['خدمة المتقدمين', 'الرد على الاستفسارات', 'متابعة الحالات', 'إدارة قاعدة البيانات', 'التواصل الفعال'],
  'جذب واستقبال': ['استقطاب الأعضاء الجدد', 'تنظيم التسجيل', 'مقابلات القبول', 'الترويج للبرنامج', 'إدارة الفعاليات الترويجية'],
  'فريق مركزي': ['التنسيق العام', 'إدارة الأزمات', 'المتابعة والرقابة', 'التواصل بين اللجان', 'التقارير الدورية'],
  'ملف التفعيل': ['اعتماد المشاركات التطوعية', 'توفير الفرص التطوعية', 'توثيق المشاركات', 'متابعة المتطوعين', 'التواصل مع المتطوعين'],
  'ملف التوسع': ['التوسع داخل الجامعات', 'بناء الأسر', 'إدارة نمو الأسر', 'زيادة الانتشار', 'التواصل مع الجامعات'],
  'منسقي القطاعات': ['متابعة تشغيل الجامعات', 'الربط بالفريق المركزي', 'التقارير', 'متابعة الأداء', 'التنسيق بين الجامعات'],
  'مسؤولي الجامعات': ['إدارة الجامعة', 'تشغيل الجامعة', 'متابعة الفعاليات', 'إدارة الأسر', 'التقارير الدورية']
};

var DEFAULT_TRAINING_NEEDS = {
  'قيادة': ['التخطيط الاستراتيجي', 'اتخاذ القرارات', 'التفويض الفعال', 'القيادة بالتأثير'],
  'تنظيم': ['إدارة الوقت', 'إدارة الفعاليات', 'التخطيط اللوجستي', 'التنسيق بين الفرق'],
  'مهارات تقنية': ['التصميم الجرافيكي', 'التصوير والمونتاج', 'استخدام Excel', 'العمل على Google Suite'],
  'مهارات ناعمة': ['التواصل الفعال', 'العمل الجماعي', 'التفكير النقدي', 'إدارة الضغط']
};

// ═══════════════════════════════════════════
// إعداد التبويبات (شغّل مرة واحدة فقط)
// ═══════════════════════════════════════════

function setupAllSheets() {
  var ss = getMainSpreadsheet();
  
  // ──── Settings ────
  createOrUpdateSheet(ss, 'Settings', [
    ['Key', 'Value'],
    ['Camp Name', 'برنامج مدار | كامب جذور'],
    ['Registration Open', true],
    ['Max Tracks', 2],
    ['Logo URL', '']
  ]);
  
  // ──── Committees ────
  var commData = [['Committee Name']];
  DEFAULT_COMMITTEES.forEach(function(c) { commData.push([c]); });
  createOrUpdateSheet(ss, 'Committees', commData);
  
  // ──── Committee Skills ────
  var skillsData = [['Committee', 'Skill']];
  Object.keys(DEFAULT_COMMITTEE_SKILLS).forEach(function(committee) {
    DEFAULT_COMMITTEE_SKILLS[committee].forEach(function(skill) {
      skillsData.push([committee, skill]);
    });
  });
  createOrUpdateSheet(ss, 'Committee Skills', skillsData);
  
  // ──── Training Needs ────
  var needsData = [['Category', 'Need']];
  Object.keys(DEFAULT_TRAINING_NEEDS).forEach(function(category) {
    DEFAULT_TRAINING_NEEDS[category].forEach(function(need) {
      needsData.push([category, need]);
    });
  });
  createOrUpdateSheet(ss, 'Training Needs', needsData);
  
  // ──── Camp Registration ────
  var regSheet = ss.getSheetByName('Camp Registration');
  if (!regSheet) {
    regSheet = ss.insertSheet('Camp Registration');
  }
  setupRegistrationHeaders(regSheet);
  
  Logger.log('تم إعداد جميع التبويبات بنجاح!');
  return 'تم إعداد جميع التبويبات بنجاح!';
}

function createOrUpdateSheet(ss, name, data) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  sheet.clearContents();
  if (data && data.length > 0) {
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    sheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold').setBackground('#014976').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, data[0].length);
  }
}

// ═══════════════════════════════════════════
// نقطة الدخول
// ═══════════════════════════════════════════

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getMetadata') {
    var result = handleGetMetadata();
    return jsonResponse(result);
  }
  
  return jsonResponse({
    status: 'success',
    message: 'نظام تسجيل برنامج مدار | كامب جذور يعمل بشكل طبيعي',
    version: '1.0.0'
  });
}

function doPost(e) {
  try {
    var requestData;
    
    if (e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    } else {
      return jsonResponse({ status: 'error', message: 'لم يتم استلام أي بيانات' }, 400);
    }
    
    var action = requestData.action;
    
    if (!action) {
      return jsonResponse({ status: 'error', message: 'لم يتم تحديد نوع الطلب' }, 400);
    }
    
    var result;
    
    switch (action) {
      case 'checkNationalID':
        result = handleCheckNationalID(requestData);
        break;
      case 'getMetadata':
        result = handleGetMetadata();
        break;
      case 'submitRegistration':
        result = handleSubmitRegistration(requestData);
        break;
      case 'sendWelcomeEmail':
        result = handleSendWelcomeEmail(requestData);
        break;
      default:
        result = { status: 'error', message: 'نوع الطلب غير معروف: ' + action };
        break;
    }
    
    return jsonResponse(result);
    
  } catch (e) {
    Logger.log('خطأ عام: ' + e.toString());
    return jsonResponse({ status: 'error', message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' }, 500);
  }
}

// ═══════════════════════════════════════════
// معالجات API
// ═══════════════════════════════════════════

function handleCheckNationalID(data) {
  var nationalId = sanitizeString(data.nationalId);
  
  var validation = validateNationalID(nationalId);
  if (!validation.valid) {
    return { status: 'error', message: validation.message };
  }
  
  nationalId = validation.value;
  
  if (isDuplicate(nationalId)) {
    return { status: 'duplicate', message: 'لقد قمت بالتسجيل بالفعل. لا يمكن التسجيل مرة أخرى.' };
  }
  
  var result = findNationalID(nationalId);
  
  // موجود في الضبط (FULL DATA) → يدخل استمارة الكامب مباشرة
  if (result && result.found && result.source === 'full') {
    return { status: 'found', message: 'تم التحقق بنجاح' };
  }
  
  // مش في الضبط بس موجود في REG → ياخد استمارة الضبط
  if (result && result.found && result.source === 'reg') {
    return {
      status: 'reg_found',
      message: 'تم العثور على بياناتك في قاعدة بيانات الجذب. لإتمام تسجيل عضويتك، يرجى استكمال استمارة ضبط العضوية من الرابط التالي:'
    };
  }
  
  // سجّل في جذب (موجود في تبويب جذب) → يدخل الاستمارة عادي
  if (result && result.found && result.source === 'jadb') {
    return { status: 'found', message: 'تم التحقق بنجاح' };
  }
  
  // مش موجود في أي حتة → ياخد الجذب
  return { status: 'not_found', message: 'لم يتم العثور على بياناتك ضمن المتقدمين للرابطة.' };
}

function handleGetMetadata() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('metadata_v1');
  if (cached) {
    return { status: 'success', data: JSON.parse(cached) };
  }
  
  var data = {
    committees: getCommittees(),
    committeeSkills: getCommitteeSkills(),
    trainingNeeds: getTrainingNeeds(),
    settings: getSettings()
  };
  
  // تخزين مؤقت 5 دقائق لتقليل قراءة الشيت مع زيادة المستخدمين
  cache.put('metadata_v1', JSON.stringify(data), 300);
  
  return { status: 'success', data: data };
}

function handleSubmitRegistration(data) {
  var nationalId = sanitizeString(data.nationalId);
  
  var idValidation = validateNationalID(nationalId);
  if (!idValidation.valid) {
    return { status: 'error', message: idValidation.message };
  }
  
  nationalId = idValidation.value;
  
  var applicantCheck = findNationalID(nationalId);
  if (!applicantCheck || !applicantCheck.found) {
    return { status: 'error', message: 'الرقم القومي غير مسجل في قائمة المتقدمين.' };
  }

  // هينت في الشيت: قديم / من REG / جديد (سجّل جذب)
  data.applicantType = applicantCheck.source === 'full' ? 'قديم'
    : applicantCheck.source === 'reg' ? 'من REG'
    : 'جديد';
  
  var validation = validateRegistration(data);
  if (!validation.valid) {
    return { status: 'validation_error', message: 'يوجد أخطاء في البيانات المدخلة', errors: validation.errors };
  }
  
  var lock = acquireLock();
  var savedRow;
  try {
    if (isDuplicate(nationalId)) {
      return { status: 'duplicate', message: 'لقد قمت بالتسجيل بالفعل. لا يمكن التسجيل مرة أخرى.' };
    }
    savedRow = saveRegistration(data).row;
  } catch (e) {
    Logger.log('خطأ في حفظ التسجيل: ' + e.toString());
    return { status: 'error', message: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.' };
  } finally {
    releaseLock(lock);
  }
  
  // إرسال البريد الترحيبي فوراً بعد تأكيد حفظ البيانات في الشيت
  var emailSent = false;
  try {
    emailSent = sendWelcomeEmail(data);
  } catch (e) {
    Logger.log('خطأ في إرسال البريد الترحيبي: ' + e.toString());
  }
  
  return { status: 'success', message: 'تم التسجيل بنجاح! سيتم التواصل معك قريباً.', row: savedRow, emailSent: emailSent };
}

function handleSendWelcomeEmail(data) {
  var nationalId = sanitizeString(data.nationalId);
  var idCheck = validateNationalID(nationalId);
  if (!idCheck.valid) {
    return { status: 'error', message: 'رقم قومي غير صالح' };
  }
  nationalId = idCheck.value;
  
  // لا نرسل البريد إلا لمن سجّل فعلاً — يمنع إساءة استخدام الـ endpoint
  if (!isDuplicate(nationalId)) {
    return { status: 'error', message: 'غير مصرح بإرسال البريد' };
  }
  
  try {
    var result = sendWelcomeEmail(data);
    if (result) {
      return { status: 'success', message: 'تم إرسال البريد الترحيبي' };
    }
    return { status: 'error', message: 'فشل إرسال البريد' };
  } catch (e) {
    Logger.log('خطأ في إرسال البريد: ' + e.toString());
    return { status: 'error', message: 'فشل إرسال البريد' };
  }
}

// ═══════════════════════════════════════════
// التحقق من البيانات
// ═══════════════════════════════════════════

function validateNationalID(id) {
  if (!id || id === '') {
    return { valid: false, message: 'الرقم القومي مطلوب' };
  }
  var cleaned = String(id).trim();
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, message: 'الرقم القومي يجب أن يحتوي على أرقام فقط' };
  }
  return { valid: true, value: cleaned };
}

function validatePhone(phone) {
  if (!phone || phone === '') {
    return { valid: false, message: 'رقم الهاتف مطلوب' };
  }
  var cleaned = String(phone).trim().replace(/\s+/g, '');
  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, message: 'رقم الهاتف يجب أن يكون 11 رقم' };
  }
  if (!cleaned.startsWith('01')) {
    return { valid: false, message: 'رقم الهاتف يجب أن يبدأ بـ 01' };
  }
  return { valid: true, value: cleaned };
}

function validateEmail(email) {
  if (!email || email === '') {
    return { valid: false, message: 'البريد الإلكتروني مطلوب' };
  }
  var cleaned = String(email).trim().toLowerCase();
  var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleaned)) {
    return { valid: false, message: 'البريد الإلكتروني غير صحيح' };
  }
  return { valid: true, value: cleaned };
}

function validateWhatsApp(wa) {
  if (!wa || wa === '') {
    return { valid: true, value: '' };
  }
  var cleaned = String(wa).trim().replace(/\s+/g, '');
  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, message: 'رقم الواتساب يجب أن يكون 11 رقم' };
  }
  return { valid: true, value: cleaned };
}

function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: fieldName + ' مطلوب' };
  }
  return { valid: true, value: sanitizeString(value) };
}

function validateTracks(track1, track2) {
  if (!track1 || track1.trim() === '') {
    return { valid: false, message: 'يجب اختيار لجنة واحدة على الأقل' };
  }
  if (track2 && track2.trim() !== '' && track1.trim() === track2.trim()) {
    return { valid: false, message: 'لا يمكن اختيار لجنة مكررة' };
  }
  return { valid: true };
}

function validateRegistration(data) {
  var errors = [];
  
  var nameCheck = validateRequired(data.fullName, 'الاسم الكامل');
  if (!nameCheck.valid) {
    errors.push(nameCheck.message);
  } else if (String(data.fullName).trim().split(/\s+/).length < 4) {
    errors.push('الاسم الكامل يجب أن يكون 4 كلمات على الأقل');
  }
  
  var phoneCheck = validatePhone(data.phone);
  if (!phoneCheck.valid) errors.push(phoneCheck.message);
  
  var waCheck = validateWhatsApp(data.whatsapp);
  if (!waCheck.valid) errors.push(waCheck.message);
  
  var idCheck = validateNationalID(data.nationalId);
  if (!idCheck.valid) errors.push(idCheck.message);
  
  var emailCheck = validateEmail(data.email);
  if (!emailCheck.valid) errors.push(emailCheck.message);
  
  var govCheck = validateRequired(data.governorate, 'المحافظة');
  if (!govCheck.valid) errors.push(govCheck.message);
  
  var uniCheck = validateRequired(data.university, 'الجامعة');
  if (!uniCheck.valid) errors.push(uniCheck.message);
  
  var facultyCheck = validateRequired(data.faculty, 'الكلية');
  if (!facultyCheck.valid) errors.push(facultyCheck.message);
  
  var yearCheck = validateRequired(data.studyYear, 'الفرقة الدراسية');
  if (!yearCheck.valid) errors.push(yearCheck.message);
  
  if (data.willAttendAllDays === undefined || data.willAttendAllDays === '') {
    errors.push('هل ستحضر جميع الأيام؟ مطلوب');
  }
  
  if (data.willAttendAllDays === 'لا' && (!data.absentDays || data.absentDays.trim() === '')) {
    errors.push('يجب تحديد الأيام التي قد تتغيب عنها');
  }
  
  if (data.agree80Percent === undefined || data.agree80Percent === false || data.agree80Percent !== true) {
    errors.push('يجب الموافقة على حضور 80% على الأقل');
  }
  
  var whyJoinCheck = validateRequired(data.whyJoin, 'سبب الانضمام');
  if (!whyJoinCheck.valid) errors.push(whyJoinCheck.message);
  
  var desiredSkillCheck = validateRequired(data.desiredSkill, 'المهارة المطلوب تطويرها');
  if (!desiredSkillCheck.valid) errors.push(desiredSkillCheck.message);
  
  var challengeCheck = validateRequired(data.biggestChallenge, 'أكبر تحدي');
  if (!challengeCheck.valid) errors.push(challengeCheck.message);
  
  var expectationsCheck = validateRequired(data.expectations, 'التوقعات بعد البرنامج');
  if (!expectationsCheck.valid) errors.push(expectationsCheck.message);
  
  var trackCheck = validateTracks(data.track1, data.track2);
  if (!trackCheck.valid) errors.push(trackCheck.message);
  
  if (!data.pledge) {
    errors.push('يجب الموافقة على الإقرار');
  }
  
  return { valid: errors.length === 0, errors: errors };
}

// ═══════════════════════════════════════════
// التعامل مع Google Sheets
// ═══════════════════════════════════════════

function getMainSpreadsheet() {
  return SpreadsheetApp.openById(MAIN_SHEET_ID);
}

function getApplicantsSpreadsheet() {
  return SpreadsheetApp.openById(APPLICANTS_SHEET_ID);
}

function findNationalID(nationalId) {
  var fullResult = findInTab(APPLICANTS_TAB_NAME, APPLICANTS_ID_COLUMNS, nationalId);
  if (fullResult && fullResult.found) {
    fullResult.source = 'full';
    return fullResult;
  }

  var regResult = findInTab(REG_TAB_NAME, [1], nationalId);
  if (regResult && regResult.found) {
    regResult.source = 'reg';
    return regResult;
  }

  var jadbResult = findInTab(JADB_TAB_NAME, [1], nationalId);
  if (jadbResult && jadbResult.found) {
    jadbResult.source = 'jadb';
    return jadbResult;
  }

  return { found: false };
}

function findInTab(tabName, columns, nationalId) {
  try {
    var ss = getApplicantsSpreadsheet();
    var sheet = ss.getSheetByName(tabName);

    if (!sheet) {
      Logger.log('لم يتم العثور على التبويب: ' + tabName);
      return null;
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;

    for (var c = 0; c < columns.length; c++) {
      var col = columns[c];
      var range = sheet.getRange(2, col, lastRow - 1, 1);
      var values = range.getValues();

      for (var i = 0; i < values.length; i++) {
        var cellVal = String(values[i][0]).trim();
        if (cellVal === nationalId) {
          return { found: true, row: i + 2 };
        }
      }
    }

    return { found: false };
  } catch (e) {
    Logger.log('خطأ في البحث عن الرقم القومي في تاب ' + tabName + ': ' + e.toString());
    return { found: false, error: e.toString() };
  }
}

function isDuplicate(nationalId) {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Camp Registration');
    
    if (!sheet || sheet.getLastRow() < 2) return false;
    
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(2, 2, lastRow - 1, 1);
    var values = range.getValues();
    
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === nationalId) {
        return true;
      }
    }
    
    return false;
  } catch (e) {
    Logger.log('خطأ في التحقق من التكرار: ' + e.toString());
    return false;
  }
}

function saveRegistration(data) {
  var ss = getMainSpreadsheet();
  var sheet = ss.getSheetByName('Camp Registration');
  
  if (!sheet) {
    sheet = ss.insertSheet('Camp Registration');
    setupRegistrationHeaders(sheet);
  }
  
  var selfAssessment = data.selfAssessment || {};
  
  var row = [
    new Date(),
    data.nationalId,
    data.fullName,
    data.phone,
    data.whatsapp,
    data.email,
    data.governorate,
    data.university,
    data.faculty,
    data.studyYear,
    data.isCurrentMember || 'لا',
    data.committee || '',
    data.currentPosition || '',
    data.joinYear || '',
    data.attendedTraining || 'لا',
    data.trainingProgramName || '',
    data.willAttendAllDays || '',
    data.absentDays || '',
    data.agree80Percent ? 'نعم' : 'لا',
    data.whyJoin,
    data.desiredSkill,
    data.biggestChallenge,
    data.expectations,
    selfAssessment.leadership || '',
    selfAssessment.teamManagement || '',
    selfAssessment.communication || '',
    selfAssessment.planning || '',
    selfAssessment.teamwork || '',
    selfAssessment.timeManagement || '',
    selfAssessment.problemSolving || '',
    selfAssessment.eventManagement || '',
    selfAssessment.followUp || '',
    JSON.stringify(data.committeeSkills || []),
    data.wantLeadershipPosition || 'لم أحدد بعد',
    JSON.stringify(data.trainingNeeds || []),
    JSON.stringify(data.committeeSpecificNeeds || []),
    data.otherNeeds || '',
    data.hasLaptop ? 'نعم' : 'لا',
    data.hasSmartphone ? 'نعم' : 'لا',
    data.hasGmail ? 'نعم' : 'لا',
    data.canGoogleDrive ? 'نعم' : 'لا',
    data.canGoogleSheets ? 'نعم' : 'لا',
    data.canGoogleForms ? 'نعم' : 'لا',
    data.canCanva ? 'نعم' : 'لا',
    data.internetQuality || '',
    data.track1 || '',
    data.track2 || '',
    JSON.stringify(data.whatCanYouOffer || []),
    data.pledge ? 'نعم' : 'لا',
    data.applicantType || 'جديد',
    'مكتمل'
  ];
  
  // منع Formula Injection: تحويل أي نص يبدأ برمز صيغة إلى نص عادي
  row = row.map(function (v) {
    return typeof v === 'string' ? sanitizeCell(v) : v;
  });
  
  sheet.appendRow(row);
  
  // التحقق الفعلي: قراءة الصف بعد الكتابة للتأكد من حفظ البيانات قبل إرجاع النجاح
  var newRow = sheet.getLastRow();
  var writtenNationalId = sheet.getRange(newRow, 2, 1, 1).getValue();
  var expectedNationalId = String(data.nationalId);
  var actualNationalId = String(writtenNationalId).trim().replace(/^'/, '');
  
  if (actualNationalId !== expectedNationalId) {
    throw new Error('تعذر تأكيد حفظ البيانات في الشيت');
  }
  
  Logger.log('تم حفظ التسجيل في الصف: ' + newRow);
  return { success: true, row: newRow };
}

function setupRegistrationHeaders(sheet) {
  var headers = [
    'Timestamp', 'National ID', 'Full Name', 'Phone', 'WhatsApp',
    'Email', 'Governorate', 'University', 'Faculty', 'Study Year',
    'Is Current Member', 'Committee',
    'Current Position', 'Join Year', 'Attended Training',
    'Training Program Name', 'Will Attend All Days', 'Absent Days',
    'Agree 80%', 'Why Join', 'Desired Skill', 'Biggest Challenge',
    'Expectations', 'Leadership', 'Team Management', 'Communication',
    'Planning', 'Teamwork', 'Time Management', 'Problem Solving',
    'Event Management', 'Follow-up', 'Committee Skills',
    'Want Leadership Position', 'Training Needs',
    'Committee Specific Needs', 'Other Needs', 'Has Laptop',
    'Has Smartphone', 'Has Gmail', 'Google Drive', 'Google Sheets',
    'Google Forms', 'Canva', 'Internet Quality', 'Track 1', 'Track 2',
    'What Can You Offer', 'Pledge', 'Applicant Type', 'Status'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#014976').setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

function getCommittees() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Committees');
    
    if (!sheet) return DEFAULT_COMMITTEES;
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return DEFAULT_COMMITTEES;
    
    var range = sheet.getRange(2, 1, lastRow - 1, 1);
    var values = range.getValues();
    var committees = [];
    
    for (var i = 0; i < values.length; i++) {
      var val = String(values[i][0]).trim();
      if (val !== '') {
        committees.push(val);
      }
    }
    
    return committees.length > 0 ? committees : DEFAULT_COMMITTEES;
  } catch (e) {
    Logger.log('خطأ في جلب اللجان: ' + e.toString());
    return DEFAULT_COMMITTEES;
  }
}

function getCommitteeSkills() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Committee Skills');
    
    if (!sheet) return DEFAULT_COMMITTEE_SKILLS;
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return DEFAULT_COMMITTEE_SKILLS;
    
    var range = sheet.getRange(2, 1, lastRow - 1, 2);
    var values = range.getValues();
    var skills = {};
    
    for (var i = 0; i < values.length; i++) {
      var committee = String(values[i][0]).trim();
      var skill = String(values[i][1]).trim();
      
      if (committee !== '') {
        if (!skills[committee]) {
          skills[committee] = [];
        }
        if (skill !== '') {
          skills[committee].push(skill);
        }
      }
    }
    
    return Object.keys(skills).length > 0 ? skills : DEFAULT_COMMITTEE_SKILLS;
  } catch (e) {
    Logger.log('خطأ في جلب مهارات اللجان: ' + e.toString());
    return DEFAULT_COMMITTEE_SKILLS;
  }
}

function getTrainingNeeds() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Training Needs');
    
    if (!sheet) return DEFAULT_TRAINING_NEEDS;
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return DEFAULT_TRAINING_NEEDS;
    
    var range = sheet.getRange(2, 1, lastRow - 1, 2);
    var values = range.getValues();
    var needs = {};
    
    for (var i = 0; i < values.length; i++) {
      var category = String(values[i][0]).trim();
      var need = String(values[i][1]).trim();
      
      if (category !== '') {
        if (!needs[category]) {
          needs[category] = [];
        }
        if (need !== '') {
          needs[category].push(need);
        }
      }
    }
    
    return Object.keys(needs).length > 0 ? needs : DEFAULT_TRAINING_NEEDS;
  } catch (e) {
    Logger.log('خطأ في جلب الاحتياجات: ' + e.toString());
    return DEFAULT_TRAINING_NEEDS;
  }
}

function getSettings() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Settings');
    
    if (!sheet) {
      return { campName: 'برنامج مدار | كامب جذور', registrationOpen: true, maxTracks: 2, logoUrl: '' };
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { campName: 'برنامج مدار | كامب جذور', registrationOpen: true, maxTracks: 2, logoUrl: '' };
    }
    
    var range = sheet.getRange(2, 1, lastRow - 1, 2);
    var values = range.getValues();
    var settings = {};
    
    for (var i = 0; i < values.length; i++) {
      var key = String(values[i][0]).trim();
      var value = values[i][1];
      if (key !== '') {
        settings[key] = value;
      }
    }
    
    return {
      campName: settings['Camp Name'] || 'برنامج مدار | كامب جذور',
      registrationOpen: settings['Registration Open'] !== false,
      maxTracks: parseInt(settings['Max Tracks']) || 2,
      logoUrl: settings['Logo URL'] || ''
    };
  } catch (e) {
    Logger.log('خطأ في جلب الإعدادات: ' + e.toString());
    return { campName: 'برنامج مدار | كامب جذور', registrationOpen: true, maxTracks: 2, logoUrl: '' };
  }
}

// ═══════════════════════════════════════════
// الدوال المساعدة
// ═══════════════════════════════════════════

function jsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function createLock() {
  return LockService.getScriptLock();
}

function acquireLock() {
  var lock = createLock();
  var acquired = lock.tryLock(5000);
  if (!acquired) {
    throw new Error('الخدمة مشغولة حالياً، يرجى المحاولة مرة أخرى.');
  }
  return lock;
}

function releaseLock(lock) {
  if (lock) {
    lock.releaseLock();
  }
}

function sendWelcomeEmail(data) {
  var subject = 'تأكيد التسجيل - برنامج مدار | كامب جذور';
  var htmlBody = buildWelcomeEmailHtml(data);
  var textBody = buildWelcomeEmailText(data);
  
  try {
    GmailApp.sendEmail(data.email, subject, textBody, {
      htmlBody: htmlBody,
      name: 'كامب جذور - رابطة أسر صناع الحياة بالجامعات المصرية'
    });
    Logger.log('تم إرسال البريد الترحيبي');
    return true;
  } catch (e) {
    Logger.log('خطأ في إرسال البريد: ' + e.toString());
    return false;
  }
}

function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emailSummaryRow(label, value, ltr) {
  var dirStyle = ltr ? 'direction:ltr;text-align:right;' : '';
  return '<tr>' +
    '<td style="padding:9px 0;border-bottom:1px solid #EDEAE3;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:13px;color:#5A6B7A;width:42%;">' + label + '</td>' +
    '<td style="padding:9px 0;border-bottom:1px solid #EDEAE3;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:13px;color:#0d2536;font-weight:700;' + dirStyle + '">' + value + '</td>' +
    '</tr>';
}

function buildWelcomeEmailText(data) {
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
  body += 'للتواصل معنا: Lifemakersclub.it@gmail.com';
  return body;
}

function buildWelcomeEmailHtml(data) {
  var LOGO_MADAR = 'https://lifemakersclubit-art.github.io/CAMP_ITUELM/logo-madar.png';
  var LOGO_BLUE = 'https://lifemakersclubit-art.github.io/CAMP_ITUELM/logo-blue.png';
  var LOGO_JADOUR = 'https://lifemakersclubit-art.github.io/CAMP_ITUELM/logo-jadour.png';
  var PHOTO = 'https://lifemakersclubit-art.github.io/CAMP_ITUELM/ITUELM_PHOTO.jpg';
  
  var fullName = escapeHtml(data.fullName);
  var nationalId = escapeHtml(data.nationalId);
  var phone = escapeHtml(data.phone);
  var email = escapeHtml(data.email);
  var university = escapeHtml(data.university);
  var governorate = escapeHtml(data.governorate);
  
  var summaryRows = '';
  summaryRows += emailSummaryRow('الاسم بالكامل', fullName, false);
  summaryRows += emailSummaryRow('الرقم القومي', nationalId, true);
  summaryRows += emailSummaryRow('رقم الهاتف', phone, true);
  summaryRows += emailSummaryRow('البريد الإلكتروني', email, true);
  summaryRows += emailSummaryRow('المحافظة', governorate, false);
  summaryRows += emailSummaryRow('الجامعة', university, false);
  
  return '' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E9E6DE;padding:28px 12px;">' +
  '<tr><td align="center">' +
  '<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#F4F3EF;border-radius:18px;overflow:hidden;box-shadow:0 24px 70px rgba(1,47,82,.22);">' +
  
  // شريط علوي برتقالي
  '<tr><td height="6" style="height:6px;background:#FBAE42;"></td></tr>' +
  
  // الهيدر: اللوجوهات الثلاثة
  '<tr><td align="center" style="background:#F4F3EF;padding:30px 20px 8px;">' +
  '<table role="presentation" cellpadding="0" cellspacing="0">' +
  '<tr>' +
  '<td align="center" valign="middle" style="padding:0 9px;"><img src="' + LOGO_MADAR + '" width="72" height="72" alt="لوجو مدار" style="display:block;width:72px;height:72px;object-fit:contain;"></td>' +
  '<td align="center" valign="middle" style="padding:0 9px;"><img src="' + LOGO_BLUE + '" width="88" height="88" alt="لوجو الرابطة" style="display:block;width:88px;height:88px;object-fit:contain;"></td>' +
  '<td align="center" valign="middle" style="padding:0 9px;"><img src="' + LOGO_JADOUR + '" width="72" height="72" alt="لوجو جذور" style="display:block;width:72px;height:72px;object-fit:contain;"></td>' +
  '</tr></table>' +
  '<p style="font-family:\'Tajawal\',Tahoma,sans-serif;color:#5A6B7A;font-size:12px;margin:10px 0 0;letter-spacing:.3px;">رابطة أسر صناع الحياة بالجامعات المصرية</p>' +
  '</td></tr>' +
  
  // الهيرو: صورة الأعضاء + اللوجو
  '<tr><td align="center" style="background-image:linear-gradient(180deg,rgba(1,47,82,.82) 0%,rgba(1,73,118,.9) 55%,rgba(1,47,82,.94) 100%),url(\'' + PHOTO + '\');background-size:cover;background-position:center;background-color:#014976;padding:44px 20px 40px;">' +
  '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 22px;">' +
  '<tr><td align="center" style="background:#ffffff;border-radius:50%;padding:10px;width:92px;height:92px;box-shadow:0 10px 30px rgba(0,0,0,.35);">' +
  '<img src="' + LOGO_BLUE + '" width="92" height="92" alt="لوجو الرابطة" style="display:block;width:92px;height:92px;border-radius:50%;object-fit:contain;">' +
  '</td></tr></table>' +
  '<h1 style="margin:0;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:900;font-size:38px;color:#ffffff;line-height:1.2;">برنامج مدار</h1>' +
  '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px auto;"><tr>' +
  '<td width="42" style="height:3px;background:#FBAE42;border-radius:10px;"></td>' +
  '<td width="10"></td>' +
  '<td align="center" style="color:#FBAE42;font-size:11px;line-height:1;">&#9670;</td>' +
  '<td width="10"></td>' +
  '<td width="42" style="height:3px;background:#FBAE42;border-radius:10px;"></td>' +
  '</tr></table>' +
  '<h2 style="margin:0;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:800;font-size:26px;color:#FBAE42;line-height:1.2;">كامب جذور</h2>' +
  '<p style="margin:12px 0 0;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:13px;color:rgba(255,255,255,.82);">تأكيد استلام طلب التسجيل</p>' +
  '</td></tr>' +
  
  // المحتوى
  '<tr><td style="background:#F4F3EF;padding:38px 34px 12px;">' +
  '<p style="margin:0 0 6px;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:800;font-size:20px;color:#014976;">السيدة / السيد ' + fullName + '</p>' +
  '<p style="margin:0 0 20px;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:14px;color:#3d4f5e;line-height:1.9;">السلام عليكم ورحمة الله وبركاته،<br>يسعدنا إبلاغكم بأنه <strong style="color:#014976;">قد تم استلام طلبكم بنجاح</strong> للتسجيل في برنامج مدار | كامب جذور.</p>' +
  
  // بطاقة ملخص البيانات
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border-right:5px solid #FBAE42;box-shadow:0 6px 24px rgba(1,47,82,.08);">' +
  '<tr><td style="padding:20px 22px 4px;"><p style="margin:0 0 14px;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:800;font-size:15px;color:#014976;">ملخص بيانات الطلب</p></td></tr>' +
  '<tr><td style="padding:0 22px;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + summaryRows + '</table>' +
  '</td></tr>' +
  '<tr><td style="height:18px;"></td></tr>' +
  '</table>' +
  
  '<p style="margin:24px 0 0;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:14px;color:#3d4f5e;line-height:1.9;">سيتم مراجعة طلبكم والرد عليكم خلال الفترة المقبلة.<br>نتطلع للقائكم في برنامج مدار | كامب جذور.</p>' +
  '<p style="margin:26px 0 0;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:700;font-size:14px;color:#0d2536;">مع خالص التقدير والاحترام،</p>' +
  '<p style="margin:4px 0 0;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:800;font-size:15px;color:#014976;">فريق برنامج مدار | كامب جذور</p>' +
  '</td></tr>' +
  
  // فاصل
  '<tr><td align="center" style="background:#F4F3EF;padding:26px 20px 30px;">' +
  '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
  '<td width="80" style="height:1px;background:linear-gradient(90deg,rgba(1,73,118,0),rgba(1,73,118,.35));"></td>' +
  '<td align="center" style="padding:0 14px;color:#FBAE42;font-size:12px;">&#9670;</td>' +
  '<td width="80" style="height:1px;background:linear-gradient(270deg,rgba(1,73,118,0),rgba(1,73,118,.35));"></td>' +
  '</tr></table>' +
  '</td></tr>' +
  
  // الفوتر: اللوجوهات في مستطيل أبيض
  '<tr><td align="center" style="background:#ffffff;padding:42px 20px 36px;">' +
  '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
  '<td align="center" valign="middle" style="padding:0 14px;"><img src="' + LOGO_MADAR + '" width="88" height="88" alt="لوجو مدار" style="display:block;width:88px;height:88px;object-fit:contain;"></td>' +
  '<td align="center" valign="middle" style="padding:0 14px;"><img src="' + LOGO_BLUE + '" width="100" height="100" alt="لوجو الرابطة" style="display:block;width:100px;height:100px;object-fit:contain;"></td>' +
  '<td align="center" valign="middle" style="padding:0 14px;"><img src="' + LOGO_JADOUR + '" width="88" height="88" alt="لوجو جذور" style="display:block;width:88px;height:88px;object-fit:contain;"></td>' +
  '</tr></table>' +
  '<p style="margin:24px 0 0;font-family:\'Cairo\',Tahoma,sans-serif;font-weight:800;font-size:16px;color:#014976;">برنامج مدار | كامب جذور</p>' +
  '<p style="margin:6px 0 0;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:13px;color:#5A6B7A;">رابطة أسر صناع الحياة بالجامعات المصرية</p>' +
  '<p style="margin:14px 0 0;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:13px;color:#3d4f5e;direction:ltr;">Lifemakersclub.it@gmail.com</p>' +
  '</td></tr>' +
  
  // شريط سفلي برتقالي
  '<tr><td height="6" style="height:6px;background:#FBAE42;"></td></tr>' +
  
  '</table>' +
  '<p style="max-width:620px;width:100%;margin:16px auto 0;font-family:\'Tajawal\',Tahoma,sans-serif;font-size:11px;color:#7a8c9b;text-align:center;line-height:1.7;">هذه رسالة تلقائية صادرة من نظام التسجيل — لا ترد على هذا البريد.<br>للتواصل مع الدعم الفني: 01032894453</p>' +
  '</td></tr></table>';
}

function sanitizeString(str) {
  if (!str) return '';
  return String(str).trim().replace(/\s+/g, ' ');
}

function sanitizeCell(value) {
  var s = String(value);
  var trimmed = s.trim();
  if (trimmed.length > 0 && /^[=+\-@\t\r]/.test(trimmed)) {
    return "'" + s;
  }
  return value;
}

function logEvent(action, details) {
  Logger.log('[' + new Date().toISOString() + '] ' + action + ': ' + JSON.stringify(details));
}

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
  'جذب واستقبال'
];

var DEFAULT_COMMITTEE_SKILLS = {
  'IT': ['إعداد وصيانة الأنظمة', 'الدعم الفني', 'إدارة الشبكات', 'تطوير المواقع', 'أمن المعلومات'],
  'HR': ['التوظيف', 'بناء الفرق', 'إدارة الأداء', 'حل النزاعات', 'التواصل الداخلي'],
  'PR': ['العلاقات العامة', 'التواصل الخارجي', 'بناء الشراكات', 'إدارة الملفات الرسمية', 'التواصل الكتابي'],
  'ميديا': ['التصوير الفوتوغرافي', 'المونتاج', 'التصميم الجرافيكي', 'إدارة صفحات التواصل', 'البث المباشر'],
  'تنمية وتدريب': ['تصميم البرامج التدريبية', 'المحاضرة الفعالة', 'التدريب عن بُعد', 'تقييم الأداء', 'التخطيط الاستراتيجي'],
  'تواصل ودعم': ['خدمة المتقدمين', 'الرد على الاستفسارات', 'متابعة الحالات', 'إدارة قاعدة البيانات', 'التواصل الفعال'],
  'جذب واستقبال': ['استقطاب الأعضاء الجدد', 'تنظيم التسجيل', 'مقابلات القبول', 'الترويج للبرنامج', 'إدارة الفعاليات الترويجية']
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
  
  if (!result || !result.found) {
    return { status: 'not_found', message: 'لم يتم العثور على بياناتك ضمن المتقدمين للرابطة.' };
  }
  
  return { status: 'found', message: 'تم التحقق بنجاح', applicantData: result.data };
}

function handleGetMetadata() {
  var committees = getCommittees();
  var committeeSkills = getCommitteeSkills();
  var trainingNeeds = getTrainingNeeds();
  var settings = getSettings();
  
  return {
    status: 'success',
    data: {
      committees: committees,
      committeeSkills: committeeSkills,
      trainingNeeds: trainingNeeds,
      settings: settings
    }
  };
}

function handleSubmitRegistration(data) {
  var nationalId = sanitizeString(data.nationalId);
  
  var idValidation = validateNationalID(nationalId);
  if (!idValidation.valid) {
    return { status: 'error', message: idValidation.message };
  }
  
  nationalId = idValidation.value;
  
  if (isDuplicate(nationalId)) {
    return { status: 'duplicate', message: 'لقد قمت بالتسجيل بالفعل. لا يمكن التسجيل مرة أخرى.' };
  }
  
  var applicantCheck = findNationalID(nationalId);
  if (!applicantCheck || !applicantCheck.found) {
    return { status: 'error', message: 'الرقم القومي غير مسجل في قائمة المتقدمين.' };
  }
  
  var validation = validateRegistration(data);
  if (!validation.valid) {
    return { status: 'validation_error', message: 'يوجد أخطاء في البيانات المدخلة', errors: validation.errors };
  }
  
  var lock = acquireLock();
  try {
    var result = saveRegistration(data);
    
    try {
      sendWelcomeEmail(data);
    } catch (emailError) {
      Logger.log('تنبيه: فشل إرسال البريد الترحيبي: ' + emailError.toString());
    }
    
    return { status: 'success', message: 'تم التسجيل بنجاح! سيتم التواصل معك قريباً.', row: result.row };
  } catch (e) {
    Logger.log('خطأ في حفظ التسجيل: ' + e.toString());
    return { status: 'error', message: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.' };
  } finally {
    releaseLock(lock);
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
  if (!nameCheck.valid) errors.push(nameCheck.message);
  
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
  try {
    var ss = getApplicantsSpreadsheet();
    var sheet = ss.getSheetByName(APPLICANTS_TAB_NAME);
    
    if (!sheet) {
      Logger.log('لم يتم العثور على التبويب: ' + APPLICANTS_TAB_NAME);
      return null;
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;
    
    // البحث في العمود K أولاً
    var rangeK = sheet.getRange(2, APPLICANTS_ID_COLUMNS[0], lastRow - 1, 1);
    var valuesK = rangeK.getValues();
    
    for (var i = 0; i < valuesK.length; i++) {
      var cellVal = String(valuesK[i][0]).trim();
      if (cellVal === nationalId) {
        var row = i + 2;
        var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
        return {
          found: true,
          row: row,
          data: {
            nationalId: nationalId,
            name: rowData[0] || '',
            phone: rowData[1] || '',
            university: rowData[2] || '',
            status: rowData[3] || ''
          }
        };
      }
    }
    
    // البحث في العمود L إذا لم يُوجد في K
    var rangeL = sheet.getRange(2, APPLICANTS_ID_COLUMNS[1], lastRow - 1, 1);
    var valuesL = rangeL.getValues();
    
    for (var i = 0; i < valuesL.length; i++) {
      var cellVal = String(valuesL[i][0]).trim();
      if (cellVal === nationalId) {
        var row = i + 2;
        var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
        return {
          found: true,
          row: row,
          data: {
            nationalId: nationalId,
            name: rowData[0] || '',
            phone: rowData[1] || '',
            university: rowData[2] || '',
            status: rowData[3] || ''
          }
        };
      }
    }
    
    return { found: false };
  } catch (e) {
    Logger.log('خطأ في البحث عن الرقم القومي: ' + e.toString());
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
    'مكتمل'
  ];
  
  sheet.appendRow(row);
  
  Logger.log('تم حفظ التسجيل للرقم القومي: ' + data.nationalId);
  return { success: true, row: sheet.getLastRow() };
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
    'What Can You Offer', 'Pledge', 'Status'
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
  body += 'للتواصل معنا: rwaq@lifemakers.org';
  
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

function sanitizeString(str) {
  if (!str) return '';
  return String(str).trim().replace(/\s+/g, ' ');
}

function logEvent(action, details) {
  Logger.log('[' + new Date().toISOString() + '] ' + action + ': ' + JSON.stringify(details));
}

/**
 * وحدة التحقق من صحة البيانات
 * Validation.gs
 */

/**
 * التحقق من صحة الرقم القومي المصري
 * يجب أن يكون 14 رقم
 */
function validateNationalID(id) {
  if (!id || id === '') {
    return { valid: false, message: 'الرقم القومي مطلوب' };
  }
  var cleaned = String(id).trim();
  if (!/^\d{14}$/.test(cleaned)) {
    return { valid: false, message: 'الرقم القومي يجب أن يكون 14 رقم' };
  }
  return { valid: true, value: cleaned };
}

/**
 * التحقق من صحة رقم الهاتف
 * يجب أن يكون 11 رقم ويبدأ بـ 01
 */
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

/**
 * التحقق من صحة البريد الإلكتروني
 */
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

/**
 * التحقق من صحة رقم الواتساب
 */
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

/**
 * التحقق من صحة حقل مطلوب
 */
function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: fieldName + ' مطلوب' };
  }
  return { valid: true, value: sanitizeString(value) };
}

/**
 * التحقق من صحة اختيار لجنتين فقط
 */
function validateTracks(track1, track2) {
  if (!track1 || track1.trim() === '') {
    return { valid: false, message: 'يجب اختيار لجنة واحدة على الأقل' };
  }
  if (track2 && track2.trim() !== '' && track1.trim() === track2.trim()) {
    return { valid: false, message: 'لا يمكن اختيار لجنة مكررة' };
  }
  return { valid: true };
}

/**
 * التحقق الشامل من بيانات التسجيل
 */
function validateRegistration(data) {
  var errors = [];
  
  // البيانات الشخصية
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
  
  // الحضور
  if (data.willAttendAllDays === undefined || data.willAttendAllDays === '') {
    errors.push('هل ستحضر جميع الأيام؟ مطلوب');
  }
  
  if (data.willAttendAllDays === 'لا' && (!data.absentDays || data.absentDays.trim() === '')) {
    errors.push('يجب تحديد الأيام التي قد تتغيب عنها');
  }
  
  if (data.agree80Percent === undefined || data.agree80Percent === false || data.agree80Percent !== true) {
    errors.push('يجب الموافقة على حضور 80% على الأقل');
  }
  
  // الدوافع
  var whyJoinCheck = validateRequired(data.whyJoin, 'سبب الانضمام');
  if (!whyJoinCheck.valid) errors.push(whyJoinCheck.message);
  
  var desiredSkillCheck = validateRequired(data.desiredSkill, 'المهارة المطلوب تطويرها');
  if (!desiredSkillCheck.valid) errors.push(desiredSkillCheck.message);
  
  var challengeCheck = validateRequired(data.biggestChallenge, 'أكبر تحدي');
  if (!challengeCheck.valid) errors.push(challengeCheck.message);
  
  var expectationsCheck = validateRequired(data.expectations, 'التوقعات بعد البرنامج');
  if (!expectationsCheck.valid) errors.push(expectationsCheck.message);
  
  // التراك
  var trackCheck = validateTracks(data.track1, data.track2);
  if (!trackCheck.valid) errors.push(trackCheck.message);
  
  // الإقرار
  if (!data.pledge) {
    errors.push('يجب الموافقة على الإقرار');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

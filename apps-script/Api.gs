/**
 * وحدة معالجات API
 * Api.gs
 */

/**
 * التحقق من الرقم القومي
 */
function handleCheckNationalID(data) {
  var nationalId = sanitizeString(data.nationalId);
  
  var validation = validateNationalID(nationalId);
  if (!validation.valid) {
    return {
      status: 'error',
      message: validation.message
    };
  }
  
  nationalId = validation.value;
  
  // التحقق من عدم التكرار
  if (isDuplicate(nationalId)) {
    return {
      status: 'duplicate',
      message: 'لقد قمت بالتسجيل بالفعل. لا يمكن التسجيل مرة أخرى.'
    };
  }
  
  // البحث في شيت المتقدمين
  var result = findNationalID(nationalId);
  
  if (!result || !result.found) {
    return {
      status: 'not_found',
      message: 'لم يتم العثور على بياناتك ضمن المتقدمين للرابطة.'
    };
  }
  
  return {
    status: 'found',
    message: 'تم التحقق بنجاح',
    applicantData: result.data
  };
}

/**
 * جلب البيانات الوصفية
 */
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

/**
 * حفظ بيانات التسجيل
 */
function handleSubmitRegistration(data) {
  var nationalId = sanitizeString(data.nationalId);
  
  // التحقق من صحة الرقم القومي مرة أخرى
  var idValidation = validateNationalID(nationalId);
  if (!idValidation.valid) {
    return {
      status: 'error',
      message: idValidation.message
    };
  }
  
  nationalId = idValidation.value;
  
  // التحقق من عدم التكرار مرة أخرى
  if (isDuplicate(nationalId)) {
    return {
      status: 'duplicate',
      message: 'لقد قمت بالتسجيل بالفعل. لا يمكن التسجيل مرة أخرى.'
    };
  }
  
  // التحقق من وجود الرقم القومي في شيت المتقدمين
  var applicantCheck = findNationalID(nationalId);
  if (!applicantCheck || !applicantCheck.found) {
    return {
      status: 'error',
      message: 'الرقم القومي غير مسجل في قائمة المتقدمين.'
    };
  }
  
  // التحقق الشامل من جميع البيانات
  var validation = validateRegistration(data);
  if (!validation.valid) {
    return {
      status: 'validation_error',
      message: 'يوجد أخطاء في البيانات المدخلة',
      errors: validation.errors
    };
  }
  
  // محاولة حفظ البيانات
  var lock = acquireLock();
  try {
    var result = saveRegistration(data);
    
    // إرسال بريد ترحيبي
    try {
      sendWelcomeEmail(data);
    } catch (emailError) {
      Logger.log('تنبيه: فشل إرسال البريد الترحيبي: ' + emailError.toString());
    }
    
    return {
      status: 'success',
      message: 'تم التسجيل بنجاح! سيتم التواصل معك قريباً.',
      row: result.row
    };
  } catch (e) {
    Logger.log('خطأ في حفظ التسجيل: ' + e.toString());
    return {
      status: 'error',
      message: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.'
    };
  } finally {
    releaseLock(lock);
  }
}

/**
 * وحدة التعامل مع Google Sheets
 * SheetService.gs
 */

/**
 * الحصول على ال spreadsheets
 */
function getMainSpreadsheet() {
  return SpreadsheetApp.openById(MAIN_SHEET_ID);
}

function getApplicantsSpreadsheet() {
  return SpreadsheetApp.openById(APPLICANTS_SHEET_ID);
}

/**
 * البحث عن الرقم القومي في شيت المتقدمين
 */
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
    
    // العمود K هو العمود 11
    var range = sheet.getRange(2, APPLICANTS_ID_COLUMN, lastRow - 1, 1);
    var values = range.getValues();
    
    for (var i = 0; i < values.length; i++) {
      var cellVal = String(values[i][0]).trim();
      if (cellVal === nationalId) {
        // قراءة البيانات المرتبطة
        var row = i + 2; // الصف في الشيت (يبدأ من 2 بسبب الهيدر)
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

/**
 * التحقق من عدم التكرار في شيت التسجيل
 */
function isDuplicate(nationalId) {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Camp Registration');
    
    if (!sheet || sheet.getLastRow() < 2) return false;
    
    // العمود B هو الرقم القومي (العمود 2)
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

/**
 * حفظ بيانات التسجيل
 */
function saveRegistration(data) {
  var ss = getMainSpreadsheet();
  var sheet = ss.getSheetByName('Camp Registration');
  
  if (!sheet) {
    sheet = ss.insertSheet('Camp Registration');
    setupRegistrationHeaders(sheet);
  }
  
  var row = [
    new Date(),                           // A - Timestamp
    data.nationalId,                       // B - National ID
    data.fullName,                         // C - Full Name
    data.phone,                            // D - Phone
    data.whatsapp,                         // E - WhatsApp
    data.email,                            // F - Email
    data.governorate,                      // G - Governorate
    data.university,                       // H - University
    data.faculty,                          // I - Faculty
    data.studyYear,                        // J - Study Year
    data.lifeMakersUniversity || '',       // K - Life Makers University
    data.isCurrentMember || 'لا',          // L - Is Current Member
    data.family || '',                     // M - Family
    data.committee || '',                  // N - Committee
    data.currentPosition || '',            // O - Current Position
    data.joinYear || '',                   // P - Join Year
    data.attendedTraining || 'لا',         // Q - Attended Training
    data.trainingProgramName || '',        // R - Training Program Name
    data.willAttendAllDays || '',          // S - Will Attend All Days
    data.absentDays || '',                 // T - Absent Days
    data.agree80Percent ? 'نعم' : 'لا',   // U - Agree 80%
    data.whyJoin,                          // V - Why Join
    data.desiredSkill,                     // W - Desired Skill
    data.biggestChallenge,                 // X - Biggest Challenge
    data.expectations,                     // Y - Expectations
    data.selfAssessment?.leadership || '',        // Z
    data.selfAssessment?.teamManagement || '',    // AA
    data.selfAssessment?.communication || '',     // AB
    data.selfAssessment?.planning || '',          // AC
    data.selfAssessment?.teamwork || '',          // AD
    data.selfAssessment?.timeManagement || '',    // AE
    data.selfAssessment?.problemSolving || '',    // AF
    data.selfAssessment?.eventManagement || '',   // AG
    data.selfAssessment?.followUp || '',          // AH
    JSON.stringify(data.committeeSkills || []),    // AI - Committee Skills
    data.wantLeadershipPosition || 'لم أحدد بعد', // AJ
    JSON.stringify(data.trainingNeeds || []),      // AK - Training Needs
    JSON.stringify(data.committeeSpecificNeeds || []), // AL
    data.otherNeeds || '',                         // AM
    data.hasLaptop ? 'نعم' : 'لا',                // AN
    data.hasSmartphone ? 'نعم' : 'لا',            // AO
    data.hasGmail ? 'نعم' : 'لا',                 // AP
    data.canGoogleDrive ? 'نعم' : 'لا',           // AQ
    data.canGoogleSheets ? 'نعم' : 'لا',          // AR
    data.canGoogleForms ? 'نعم' : 'لا',           // AS
    data.canCanva ? 'نعم' : 'لا',                 // AT
    data.internetQuality || '',                    // AU
    data.track1 || '',                             // AV - Track 1
    data.track2 || '',                             // AW - Track 2
    JSON.stringify(data.whatCanYouOffer || []),     // AX
    data.pledge ? 'نعم' : 'لا',                   // AY
    'مكتمل'                                        // AZ - Status
  ];
  
  sheet.appendRow(row);
  
  Logger.log('تم حفظ التسجيل للرقم القومي: ' + data.nationalId);
  return { success: true, row: sheet.getLastRow() };
}

/**
 * إعداد هيدر شيت التسجيل
 */
function setupRegistrationHeaders(sheet) {
  var headers = [
    'Timestamp', 'National ID', 'Full Name', 'Phone', 'WhatsApp',
    'Email', 'Governorate', 'University', 'Faculty', 'Study Year',
    'Life Makers University', 'Is Current Member', 'Family', 'Committee',
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
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * جلب أسماء اللجان
 */
function getCommittees() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Committees');
    
    if (!sheet) return [];
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    
    var range = sheet.getRange(2, 1, lastRow - 1, 1);
    var values = range.getValues();
    var committees = [];
    
    for (var i = 0; i < values.length; i++) {
      var val = String(values[i][0]).trim();
      if (val !== '') {
        committees.push(val);
      }
    }
    
    return committees;
  } catch (e) {
    Logger.log('خطأ في جلب اللجان: ' + e.toString());
    return [];
  }
}

/**
 * جلب مهارات اللجان
 */
function getCommitteeSkills() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Committee Skills');
    
    if (!sheet) return {};
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return {};
    
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
    
    return skills;
  } catch (e) {
    Logger.log('خطأ في جلب مهارات اللجان: ' + e.toString());
    return {};
  }
}

/**
 * جلب الاحتياجات التدريبية
 */
function getTrainingNeeds() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Training Needs');
    
    if (!sheet) return {};
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return {};
    
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
    
    return needs;
  } catch (e) {
    Logger.log('خطأ في جلب الاحتياجات: ' + e.toString());
    return {};
  }
}

/**
 * جلب الإعدادات
 */
function getSettings() {
  try {
    var ss = getMainSpreadsheet();
    var sheet = ss.getSheetByName('Settings');
    
    if (!sheet) {
      return {
        campName: 'برنامج مدار | كامب جذور',
        registrationOpen: true,
        maxTracks: 2,
        logoUrl: ''
      };
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return {
        campName: 'برنامج مدار | كامب جذور',
        registrationOpen: true,
        maxTracks: 2,
        logoUrl: ''
      };
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
    return {
      campName: 'برنامج مدار | كامب جذور',
      registrationOpen: true,
      maxTracks: 2,
      logoUrl: ''
    };
  }
}

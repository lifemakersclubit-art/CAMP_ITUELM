/**
 * برنامج مدار | كامب جذور - السكربت الرئيسي
 * script.js
 */

(function () {
  'use strict';

  // ============================================
  // المتغيرات العامة
  // ============================================
  let currentStep = 1;
  const totalSteps = 7;
  let verifiedNationalId = '';
  let volunteerType = '';
  let metadata = null;
  let isSubmitting = false;

  // ============================================
  // عناصر DOM
  // ============================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const appLoader = $('#appLoader');
  const verifySection = $('#verifySection');
  const formSection = $('#formSection');
  const successSection = $('#successSection');
  const registrationForm = $('#registrationForm');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const submitBtn = $('#submitBtn');
  const progressBar = $('#progressBar');
  const stepIndicator = $('#stepIndicator');

  // ============================================
  // التهيئة
  // ============================================
  function init() {
    setTimeout(() => {
      appLoader.classList.add('hidden');
      setTimeout(() => appLoader.remove(), 600);
    }, 1500);

    bindEvents();
  }

  function bindEvents() {
    prevBtn.addEventListener('click', goToPrevStep);
    nextBtn.addEventListener('click', goToNextStep);
    registrationForm.addEventListener('submit', handleSubmit);

    // اختيار نوع المتطوع (متطوع جديد / متطوع حالي)
    $$('#verifySection .btn-volunteer').forEach(btn => {
      btn.addEventListener('click', function () {
        handleChoice(this.getAttribute('data-answer'));
      });
    });

    // إظهار/إخفاء الحقول حسب الاختيارات
    $$('input[name="isCurrentMember"]').forEach(r => {
      r.addEventListener('change', toggleMemberFields);
    });
    $$('input[name="attendedTraining"]').forEach(r => {
      r.addEventListener('change', toggleTrainingName);
    });
    $$('input[name="willAttendAllDays"]').forEach(r => {
      r.addEventListener('change', toggleAbsentDays);
    });
    $$('input[name="whatCanYouOffer"]').forEach(r => {
      r.addEventListener('change', toggleOtherCanOffer);
    });
    $$('input[name="pledge"]').forEach(c => {
      c.addEventListener('change', toggleSubmitBtn);
    });
  }

  // ============================================
  // اختيار نوع المتطوع
  // ============================================
  function handleChoice(answer) {
    verifiedNationalId = '';
    volunteerType = answer === 'new' ? 'جديد' : 'قديم';

    // افتح الاستمارة مباشرة بدون أي تحقق
    verifySection.classList.add('d-none');
    formSection.classList.remove('d-none');

    renderDynamicFields();
    updateProgress();

    // حمّل اللجان والمهارات في الخلفية (وتستخدم الافتراضية لو فشل)
    loadMetadata().then(renderDynamicFields);
  }

  // ============================================
  // تحميل البيانات الوصفية
  // ============================================
  async function loadMetadata() {
    try {
      const response = await apiCall('getMetadata', {});
      if (response.status === 'success') {
        metadata = response.data;
      }
    } catch (err) {
      console.error('خطأ في تحميل البيانات الوصفية:', err);
      metadata = {
        committees: ['IT', 'HR', 'PR', 'ميديا', 'تنمية وتدريب', 'تواصل ودعم', 'جذب واستقبال', 'فريق مركزي', 'ملف التفعيل', 'ملف التوسع', 'منسقي القطاعات', 'مسؤولي الجامعات'],
        committeeSkills: {},
        trainingNeeds: {}
      };
    }
  }

  // ============================================
  // الحقول الديناميكية
  // ============================================
  function renderDynamicFields() {
    if (!metadata) return;

    renderTracks();
    renderCommitteeSkills();
    renderCommitteeNeeds();
  }

  function renderTracks() {
    const container = $('#tracksContainer');
    if (!container || !metadata.committees) return;

    let html = '';
    metadata.committees.forEach(function (committee, index) {
      html += '<label class="track-option">' +
        '<input type="checkbox" name="trackSelection" value="' + escapeHtml(committee) + '" ' +
        'data-index="' + index + '">' +
        '<span class="track-check"></span>' +
        '<span class="track-name">' + escapeHtml(committee) + '</span>' +
        '</label>';
    });

    container.innerHTML = html;

    // ربط الأحداث
    container.querySelectorAll('input[name="trackSelection"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const checked = container.querySelectorAll('input[name="trackSelection"]:checked');
        if (checked.length > 2) {
          this.checked = false;
          showToast('يمكن اختيار لجنتين فقط', 'warning');
        }
        updateTrackFields();
      });
    });
  }

  function updateTrackFields() {
    const checked = $$('input[name="trackSelection"]:checked');
    const track1Input = $('input[name="track1"]');
    const track2Input = $('input[name="track2"]');

    if (!track1Input) {
      // إنشاء حقول مخفية
      let h1 = document.createElement('input');
      h1.type = 'hidden';
      h1.name = 'track1';
      registrationForm.appendChild(h1);

      let h2 = document.createElement('input');
      h2.type = 'hidden';
      h2.name = 'track2';
      registrationForm.appendChild(h2);
    }

    const t1 = $('input[name="track1"]');
    const t2 = $('input[name="track2"]');

    if (checked.length >= 1) t1.value = checked[0].value; else t1.value = '';
    if (checked.length >= 2) t2.value = checked[1].value; else t2.value = '';
  }

  function renderCommitteeSkills() {
    const container = $('#committeeSkillsContainer');
    if (!container || !metadata.committeeSkills) return;

    const skills = metadata.committeeSkills;
    const committees = Object.keys(skills);

    if (committees.length === 0) {
      container.innerHTML = '<div class="text-muted text-center py-3">لا توجد مهارات مسجلة</div>';
      return;
    }

    let html = '';
    committees.forEach(function (committee) {
      const committeeSkills = skills[committee];
      if (!committeeSkills || committeeSkills.length === 0) return;

      html += '<div class="committee-skill-group">';
      html += '<h5>' + escapeHtml(committee) + '</h5>';

      committeeSkills.forEach(function (skill, idx) {
        const safeName = 'cs_' + committee.replace(/\s+/g, '_') + '_' + idx;
        html += '<div class="assessment-item">';
        html += '<span class="assessment-label">' + escapeHtml(skill) + '</span>';
        html += '<div class="rating-group" data-committee="' + escapeHtml(committee) + '" data-skill="' + escapeHtml(skill) + '">';
        for (let i = 1; i <= 5; i++) {
          html += '<label class="rating-star"><input type="radio" name="' + safeName + '" value="' + i + '"><span>' + i + '</span></label>';
        }
        html += '</div>';
        html += '</div>';
      });

      html += '</div>';
    });

    container.innerHTML = html;
  }

  function renderCommitteeNeeds() {
    const container = $('#committeeNeedsContainer');
    if (!container || !metadata.trainingNeeds) return;

    const needs = metadata.trainingNeeds;
    const categories = Object.keys(needs);

    if (categories.length === 0) {
      container.innerHTML = '<div class="text-muted text-center py-3">لا توجد احتياجات مسجلة</div>';
      return;
    }

    let html = '';
    categories.forEach(function (category) {
      const items = needs[category];
      if (!items || items.length === 0) return;

      html += '<div class="committee-skill-group">';
      html += '<h5>' + escapeHtml(category) + '</h5>';
      html += '<div class="checkbox-grid">';

      items.forEach(function (item) {
        html += '<label class="checkbox-card">';
        html += '<input type="checkbox" name="committeeSpecificNeeds" value="' + escapeHtml(category) + ': ' + escapeHtml(item) + '">';
        html += '<span class="check-mark"></span>';
        html += '<span>' + escapeHtml(item) + '</span>';
        html += '</label>';
      });

      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  // ============================================
  // إظهار/إخفاء الحقول
  // ============================================
  function toggleMemberFields() {
    const val = $('input[name="isCurrentMember"]:checked');
    const fields = $('#memberFields');
    if (!val || !fields) return;

    if (val.value === 'نعم') {
      fields.classList.remove('d-none');
    } else {
      fields.classList.add('d-none');
    }
  }

  function toggleTrainingName() {
    const val = $('input[name="attendedTraining"]:checked');
    const field = $('#trainingNameField');
    if (!val || !field) return;

    if (val.value === 'نعم') {
      field.classList.remove('d-none');
    } else {
      field.classList.add('d-none');
    }
  }

  function toggleAbsentDays() {
    const val = $('input[name="willAttendAllDays"]:checked');
    const field = $('#absentDaysField');
    if (!val || !field) return;

    if (val.value === 'لا') {
      field.classList.remove('d-none');
    } else {
      field.classList.add('d-none');
    }
  }

  function toggleSubmitBtn() {
    const pledge = $('#pledgeCheckbox');
    if (submitBtn && pledge) {
      submitBtn.disabled = !pledge.checked;
    }
  }

  function toggleOtherCanOffer() {
    const otherChecked = $('input[name="whatCanYouOffer"][value="أخرى"]');
    const field = $('#otherCanOfferField');
    if (!otherChecked || !field) return;
    if (otherChecked.checked) {
      field.classList.remove('d-none');
    } else {
      field.classList.add('d-none');
    }
  }

  // ============================================
  // التنقل بين الخطوات
  // ============================================
  function goToNextStep() {
    if (currentStep >= totalSteps) return;

    // التحقق من الحقول المطلوبة في الخطوة الحالية
    if (!validateCurrentStep()) return;

    currentStep++;
    showCurrentStep();
  }

  function goToPrevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    showCurrentStep();
  }

  function showCurrentStep() {
    $$('.form-step').forEach(function (step) {
      step.classList.remove('active');
    });

    const activeStep = $('.form-step[data-step="' + currentStep + '"]');
    if (activeStep) {
      activeStep.classList.add('active');
    }

    // تحديث أزرار التنقل
    prevBtn.classList.toggle('d-none', currentStep === 1);

    if (currentStep === totalSteps) {
      nextBtn.classList.add('d-none');
      submitBtn.classList.remove('d-none');
    } else {
      nextBtn.classList.remove('d-none');
      submitBtn.classList.add('d-none');
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    const pct = (currentStep / totalSteps) * 100;
    progressBar.style.width = pct + '%';
    stepIndicator.textContent = 'الخطوة ' + currentStep + ' من ' + totalSteps;
  }

  // ============================================
  // التحقق من صحة الخطوة الحالية
  // ============================================
  function scrollToField(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus();
  }

  function getMissingFields() {
    const missing = [];
    $$('.form-step').forEach(function (step) {
      const stepNum = parseInt(step.getAttribute('data-step'));
      const required = step.querySelectorAll('[required]');
      for (let i = 0; i < required.length; i++) {
        const field = required[i];
        if (field.closest('.d-none') || field.closest('.form-step:not(.active)')) continue;
        if (!field.value || field.value.trim() === '') {
          const label = field.closest('.form-floating-custom');
          const labelText = label ? label.querySelector('label') : null;
          missing.push({
            step: stepNum,
            field: field,
            label: labelText ? labelText.textContent.replace('*', '').trim() : field.name
          });
        }
      }
    });
    return missing;
  }

  function validateCurrentStep() {
    const step = $('.form-step[data-step="' + currentStep + '"]');
    if (!step) return true;

    // حقول مطلوبة — نتجاهل الحقول داخل حاويات مخفية (مثل عضو حالي = لا)
    const required = step.querySelectorAll('[required]');
    for (let i = 0; i < required.length; i++) {
      const field = required[i];
      if (field.closest('.d-none')) continue;
      if (!field.value || field.value.trim() === '') {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'warning');
        scrollToField(field);
        return false;
      }
    }

    // مجموعات الراديو المطلوبة (اللي ليها علامة *) — نأكد أنه اتنختار واحدة
    const radioGroups = step.querySelectorAll('.form-floating-custom');
    for (let i = 0; i < radioGroups.length; i++) {
      const g = radioGroups[i];
      if (g.closest('.d-none')) continue;
      const reqLabel = g.querySelector('.req');
      const radios = g.querySelectorAll('input[type="radio"]');
      if (!reqLabel || radios.length === 0) continue;
      let checked = false;
      for (let j = 0; j < radios.length; j++) {
        if (radios[j].checked) { checked = true; break; }
      }
      if (!checked) {
        const lbl = g.querySelector('label');
        showToast('يرجى الإجابة على: ' + (lbl ? lbl.textContent.replace('*', '').trim() : 'الحقل المطلوب'), 'warning');
        scrollToField(radios[0]);
        return false;
      }
    }

    // تحقق خاص بالخطوة
    if (currentStep === 1) {
      const name = step.querySelector('input[name="fullName"]');
      if (name && name.value.trim().split(/\s+/).length < 4) {
        showToast('الاسم الكامل يجب أن يكون 4 كلمات على الأقل', 'error');
        scrollToField(name);
        return false;
      }

      const phone = step.querySelector('input[name="phone"]');
      if (phone && !/^01\d{9}$/.test(phone.value.trim())) {
        showToast('رقم الهاتف يجب أن يبدأ بـ 01 ويكون 11 رقم', 'error');
        scrollToField(phone);
        return false;
      }

      const email = step.querySelector('input[name="email"]');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showToast('البريد الإلكتروني غير صحيح', 'error');
        scrollToField(email);
        return false;
      }
    }

    // تحقق خاص بخطوة الحضور: أوافق 80% لازم يكون متشيك، و absentDays لازم لما يختار لا
    if (currentStep === 3) {
      const agree = $('input[name="agree80Percent"]');
      if (agree && !agree.checked) {
        showToast('يجب الموافقة على الحضور 80% على الأقل', 'warning');
        scrollToField(agree);
        return false;
      }
      const willAttend = getRadio('willAttendAllDays');
      if (willAttend === 'لا') {
        const absent = $('input[name="absentDays"]');
        if (absent && (!absent.value || absent.value.trim() === '')) {
          showToast('يرجى تحديد الأيام التي قد تتغيب عنها', 'warning');
          scrollToField(absent);
          return false;
        }
      }
    }

    return true;
  }

  // ============================================
  // إرسال التسجيل
  // ============================================
  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    // لا يسمح بالإرسال إلا من الخطوة الأخيرة
    if (currentStep < totalSteps) return;

    // التحقق من الإقرار
    const pledge = $('#pledgeCheckbox');
    if (!pledge || !pledge.checked) {
      showToast('يجب الموافقة على الإقرار', 'error');
      scrollToField(pledge);
      return;
    }

    // التحقق من اختيار التراك
    updateTrackFields();
    const track1 = $('input[name="track1"]').value;
    const trackError = $('#trackError');
    if (!track1) {
      trackError.classList.remove('d-none');
      trackError.textContent = 'يجب اختيار لجنة واحدة على الأقل';
      showToast('يجب اختيار لجنة واحدة على الأقل', 'error');
      return;
    }
    trackError.classList.add('d-none');

    // جمع البيانات
    const data = collectFormData();

    // التحقق الشامل
    if (!validateFullData(data)) return;

    // جمع الحقول الناقصة
    const missingFields = getMissingFields();

    // لو فيه حقول ناقصة — يظهر تأكيد بدل الرفض
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(function(f) { return '• ' + f.label; }).join('<br>');
      const confirmed = await Swal.fire({
        title: 'هل تأكد على إرسال البيانات؟',
        html: '<p style="text-align:right;margin-bottom:10px">فيه بعض الحقول الناقصة:</p><div style="text-align:right;background:#fff3cd;padding:12px;border-radius:8px;max-height:200px;overflow-y:auto">' + fieldNames + '</div>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1a7f37',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، أرسل البيانات',
        cancelButtonText: 'إلغاء',
        rtl: true
      });
      if (!confirmed.isConfirmed) return;
    }

    isSubmitting = true;
    setLoading(submitBtn, true);

    try {
      const response = await apiCall('submitRegistration', data);

      if (response.status === 'success') {
        const successNote = $('.success-note');
        if (successNote) {
          successNote.textContent = response.emailSent
            ? 'تم إرسال بريد تأكيد إلى بريدك الإلكتروني.'
            : 'تم استلام تسجيلك وسيتم التواصل معك قريباً.';
        }
        formSection.classList.add('d-none');
        successSection.classList.remove('d-none');
        window.scrollTo({ top: 0 });
        showToast('تم التسجيل بنجاح!', 'success');
      } else if (response.status === 'validation_error') {
        const errors = response.errors || [];
        if (errors.length > 0) {
          showToast(errors[0], 'error');
        } else {
          showToast(response.message || 'يوجد أخطاء في البيانات', 'error');
        }
      } else {
        showToast(response.message || 'حدث خطأ أثناء التسجيل', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
      isSubmitting = false;
      setLoading(submitBtn, false);
    }
  }

  // ============================================
  // جمع بيانات الاستمارة
  // ============================================
  function collectFormData() {
    const data = {};

    // البيانات الشخصية
    data.fullName = getVal('fullName');
    data.nationalId = getVal('nationalId') || verifiedNationalId;
    data.phone = getVal('phone');
    data.whatsapp = getVal('whatsapp');
    data.email = getVal('email');
    data.governorate = getVal('governorate');
    data.university = getVal('university');
    data.faculty = getVal('faculty');
    data.studyYear = getVal('studyYear');

    // نوع المتطوع (جديد / حالي)
    data.applicantType = volunteerType || 'جديد';

    // العضوية
    data.isCurrentMember = getRadio('isCurrentMember');
    data.committee = getVal('committee');
    data.currentPosition = getVal('currentPosition');
    data.joinYear = getVal('joinYear');

    // الحضور
    data.attendedTraining = getRadio('attendedTraining');
    data.trainingProgramName = getVal('trainingProgramName');
    data.willAttendAllDays = getRadio('willAttendAllDays');
    data.absentDays = getVal('absentDays');
    data.agree80Percent = $('input[name="agree80Percent"]') ? $('input[name="agree80Percent"]').checked : false;

    // الدوافع
    data.whyJoin = getVal('whyJoin');
    data.desiredSkill = getVal('desiredSkill');
    data.biggestChallenge = getVal('biggestChallenge');
    data.expectations = getVal('expectations');

    // التقييم الذاتي
    data.selfAssessment = {
      leadership: getRadio('sa_leadership'),
      teamManagement: getRadio('sa_teamManagement'),
      communication: getRadio('sa_communication'),
      planning: getRadio('sa_planning'),
      teamwork: getRadio('sa_teamwork'),
      timeManagement: getRadio('sa_timeManagement'),
      problemSolving: getRadio('sa_problemSolving'),
      eventManagement: getRadio('sa_eventManagement'),
      followUp: getRadio('sa_followUp')
    };

    // تقييم مهارات اللجان (ديناميكي)
    data.committeeSkills = collectCommitteeSkills();

    // المنصب القيادي
    data.wantLeadershipPosition = getRadio('wantLeadershipPosition');

    // الاحتياجات
    data.trainingNeeds = getCheckedValues('trainingNeeds');
    data.committeeSpecificNeeds = getCheckedValues('committeeSpecificNeeds');
    data.otherNeeds = getVal('otherNeeds');

    // المعلومات التنظيمية
    data.hasLaptop = $('input[name="hasLaptop"]:checked') ? $('input[name="hasLaptop"]:checked').value === 'true' : false;
    data.hasSmartphone = $('input[name="hasSmartphone"]:checked') ? $('input[name="hasSmartphone"]:checked').value === 'true' : false;
    data.hasGmail = $('input[name="hasGmail"]:checked') ? $('input[name="hasGmail"]:checked').value === 'true' : false;
    data.canGoogleDrive = $('input[name="canGoogleDrive"]') ? $('input[name="canGoogleDrive"]').checked : false;
    data.canGoogleSheets = $('input[name="canGoogleSheets"]') ? $('input[name="canGoogleSheets"]').checked : false;
    data.canGoogleForms = $('input[name="canGoogleForms"]') ? $('input[name="canGoogleForms"]').checked : false;
    data.canCanva = $('input[name="canCanva"]') ? $('input[name="canCanva"]').checked : false;
    data.internetQuality = getVal('internetQuality');

    // التراك
    data.track1 = getVal('track1');
    data.track2 = getVal('track2');

    // ماذا يمكنك أن تقدم
    data.whatCanYouOffer = getCheckedValues('whatCanYouOffer');
    const otherOffer = getVal('otherCanOffer');
    if (otherOffer) {
      data.whatCanYouOffer = data.whatCanYouOffer.filter(function(v) { return v !== 'أخرى'; });
      data.whatCanYouOffer.push(otherOffer);
    }

    // الإقرار
    data.pledge = $('input[name="pledge"]') ? $('input[name="pledge"]').checked : false;

    return data;
  }

  function collectCommitteeSkills() {
    const skills = {};
    const ratingGroups = $$('.rating-group[data-committee]');

    ratingGroups.forEach(function (group) {
      const committee = group.getAttribute('data-committee');
      const skill = group.getAttribute('data-skill');
      const checked = group.querySelector('input:checked');

      if (!skills[committee]) skills[committee] = {};
      skills[committee][skill] = checked ? checked.value : '';
    });

    return skills;
  }

  // ============================================
  // التحقق الشامل
  // ============================================
  function validateFullData(data) {
    if (!data.fullName || data.fullName.trim().split(/\s+/).length < 4) {
      showToast('الاسم الكامل يجب أن يكون 4 كلمات على الأقل', 'error');
      goToStep(1);
      return false;
    }
    if (!data.phone || !/^01\d{9}$/.test(data.phone)) {
      showToast('رقم الهاتف غير صحيح', 'error');
      goToStep(1);
      return false;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showToast('البريد الإلكتروني غير صحيح', 'error');
      goToStep(1);
      return false;
    }
    if (!data.governorate) {
      showToast('المحافظة مطلوبة', 'error');
      goToStep(1);
      return false;
    }
    if (!data.university) {
      showToast('الجامعة مطلوبة', 'error');
      goToStep(1);
      return false;
    }
    if (!data.track1) {
      showToast('يجب اختيار لجنة واحدة على الأقل', 'error');
      goToStep(7);
      return false;
    }
    if (!data.pledge) {
      showToast('يجب الموافقة على الإقرار', 'error');
      goToStep(7);
      return false;
    }
    return true;
  }

  function goToStep(step) {
    currentStep = step;
    showCurrentStep();
  }

  // ============================================
  // helpers
  // ============================================
  function getVal(name) {
    const el = registrationForm.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  function getRadio(name) {
    const el = registrationForm.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function getCheckedValues(name) {
    const checked = registrationForm.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.from(checked).map(function (c) { return c.value; });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================
  // API
  // ============================================
  async function apiCall(action, data) {
    const payload = Object.assign({ action: action }, data);

    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }

    return await response.json();
  }

  // ============================================
  // واجهة المستخدم
  // ============================================
  function setLoading(btn, loading) {
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    if (loading) {
      btn.disabled = true;
      if (text) text.classList.add('d-none');
      if (loader) loader.classList.remove('d-none');
    } else {
      btn.disabled = false;
      if (text) text.classList.remove('d-none');
      if (loader) loader.classList.add('d-none');
    }
  }

  function showToast(message, type) {
    const config = {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      html: '<span style="font-family: Tajawal, sans-serif; font-size: 14px;">' + message + '</span>',
      customClass: { popup: 'swal-custom' }
    };

    switch (type) {
      case 'success':
        Swal.fire(Object.assign({}, config, {
          icon: 'success',
          iconColor: '#27AE60',
          background: '#F0FFF4'
        }));
        break;
      case 'error':
        Swal.fire(Object.assign({}, config, {
          icon: 'error',
          iconColor: '#C0392B',
          background: '#FFF5F5'
        }));
        break;
      case 'warning':
        Swal.fire(Object.assign({}, config, {
          icon: 'warning',
          iconColor: '#F39C12',
          background: '#FFFFF0'
        }));
        break;
      default:
        Swal.fire(Object.assign({}, config, {
          icon: 'info',
          iconColor: '#014976',
          background: '#F0F8FF'
        }));
    }
  }

  // ============================================
  // التشغيل
  // ============================================
  document.addEventListener('DOMContentLoaded', init);

})();

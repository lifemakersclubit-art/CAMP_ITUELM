# نظام تسجيل برنامج مدار | كامب جذور

نظام تسجيل إلكتروني متكامل لبرنامج مدار | كامب جذور - رابطة أسر صناع الحياة بالجامعات المصرية.

## الهيكل العام

```
├── index.html              # الصفحة الرئيسية
├── style.css               # التنسيقات
├── script.js               # المنطق البرمجي
├── config.js               # الإعدادات (API URL)
├── README.md               # التوثيق
└── apps-script/            # كود Google Apps Script
    ├── Code.gs             # الملف المدمج بالكامل (انسخه فقط)
    └── appsscript.json     # ملف الإعدادات
```

---

## الخطوة 1: إنشاء جداول Google Sheets

### الشيت الرئيسي (1V-U6PRLJ5mYH5KC2wm0A7HaEIiAvqtFl8ddTKkVTFWA)

أنشئ التبويبات التالية في هذا الشيت:

#### تبويب Settings
| A | B |
|---|---|
| Camp Name | برنامج مدار \| كامب جذور |
| Registration Open | TRUE |
| Max Tracks | 2 |
| Logo URL | (رابط الشعار إن وجد) |

#### تبويب Committees
| A |
|---|
| Committee Name |
| لجنة 1 |
| لجنة 2 |
| ... |

> **ملاحظة:** اللجان الافتراضية تشمل: `IT`, `HR`, `PR`, `ميديا`, `تنمية وتدريب`, `تواصل ودعم`, `جذب واستقبال`, `فريق مركزي`, `ملف التفعيل`, `ملف التوسع`, `منسقي القطاعات`.
> لتحديث الشيت الجاهز باللجان الجديدة: أضفها يدوياً في تبويب **Committees** (والمهارات في **Committee Skills**)، أو أعد تشغيل `setupAllSheets` بعد نشر الكود (يُعيد بناء التبويب بالافتراضات).

#### تبويب Committee Skills
| A | B |
|---|---|
| Committee | Skill |
| لجنة 1 | مهارة 1 |
| لجنة 1 | مهارة 2 |
| لجنة 2 | مهارة 1 |

#### تبويب Training Needs
| A | B |
|---|---|
| Category | Need |
| القيادة | مهارة التفويض |
| التنظيم | إدارة الوقت |

#### تبويب Camp Registration
سيتم إنشاؤها تلقائياً عند أول تسجيل، أو أنشئها يدوياً بالهيدر التالي:

`Timestamp | National ID | Full Name | Phone | WhatsApp | Email | Governorate | University | Faculty | Study Year | Is Current Member | Committee | Current Position | Join Year | Attended Training | Training Program Name | Will Attend All Days | Absent Days | Agree 80% | Why Join | Desired Skill | Biggest Challenge | Expectations | Leadership | Team Management | Communication | Planning | Teamwork | Time Management | Problem Solving | Event Management | Follow-up | Committee Skills | Want Leadership Position | Training Needs | Committee Specific Needs | Other Needs | Has Laptop | Has Smartphone | Has Gmail | Google Drive | Google Sheets | Google Forms | Canva | Internet Quality | Track 1 | Track 2 | What Can You Offer | Pledge | Applicant Type | Status`

- **Applicant Type** — هينت في الشيت يوضح نوع المتقدم: `قديم` (موجود في FULL DATA) أو `من REG` (موجود في REG فقط) أو `جديد` (سجّل من خلال الجذب)

---

### شيت المتقدمين (1QhtcTQZ0jj6pYrrdsN0tghfN7mpebXUxy5t_qEDO8Io)

البحث يتم في 3 تبويبات بالترتيب:

1. **تبويب `FULL DATA`** (الضبط) — البحث في العمودين **K و L** (11 و 12)
2. **تبويب `REG`** — بيانات إضافية، البحث في **العمود A** (الأول)
3. **تبويب `جذب`** — من سجّل استمارة الجذب، البحث في **العمود A** (الأول)

```
تبويب REG / جذب
| A           |
|-------------|
| الرقم القومي |
| 14 رقم      |
```

#### سيناريوهات التحقق (بترتيب الفحص)

| الحالة | الشرط | النتيجة |
|---|---|---|
| موجود في FULL DATA | لقاه في الضبط | **يدخل استمارة الكامب** مباشرة (الحالة: `قديم`) |
| موجود في REG فقط | مش في الضبط بس في REG | ياخد **استمارة الضبط** (jIIg4IEe) (الحالة: `من REG`) |
| سجّل في جذب | مش في الاتنين بس في تبويب جذب | **يدخل استمارة الكامب** عادي (الحالة: `جديد`) |
| مش موجود في أي تبويب | مش في أي حتة | سؤال "هل أنت متطوع؟" → **نعم**: استمارة الضبط (jIIg4IEe) / **لا**: الجذب (lnXsKATT) |

عند التسجيل، يتحط في شيت Camp Registration هينت **Applicant Type**: `قديم` لمن في FULL DATA، أو `من REG` لمن في REG، أو `جديد` لمن سجّل من خلال الجذب.

---

## الخطوة 2: نشر Google Apps Script

1. اذهب إلى [script.google.com](https://script.google.com)
2. اضغط "مشروع جديد" (New Project)
3. احذف المحتوى الافتراضي من `Code.gs`
4. **انسخ محتوى `apps-script/Code.gs`** بالكامل (الملف مدمج، ملف واحد فقط)
5. استبدل محتوى `appsscript.json` من ملف `apps-script/appsscript.json`

### نشر كـ Web App
1. اضغط "نشر" > "نشر كتطبيق ويب" (Deploy > New Deployment)
2. اختر النوع: "تطبيق ويب" (Web app)
3. Execute as: **"Me" (أنا)** — مهم جداً حتى يعمل البريد والوصول للشيتات
4. Who has access: "Anyone" (أي شخص)
5. اضغط "Deploy"
6. **انسخ رابط النشر** (يبدو مثل: `https://script.google.com/macros/s/xxxx/exec`)

### تحديث الـ Deploy
عند كل تعديل في الكود:
1. اضغط "Deploy" > "Manage Deployments"
2. اضغط التحرير (Edit) بجانب "New Deployment"
3. اختر "New version"
4. اضغط "Deploy"

---

## الخطوة 3: رفع ملفات الواجهة على GitHub Pages

1. افتح GitHub repository: `https://github.com/lifemakersclubit-art/CAMP_ITUELM.git`
2. ارفع الملفات التالية إلى الجذر:
   - `index.html`
   - `style.css`
   - `script.js`
   - `config.js`
3. غيّر محتوى `config.js` وضع رابط النشر:

```javascript
const API_URL = "https://script.google.com/macros/s/AQX.../exec";
```

4. فعّل GitHub Pages:
   - اذهب إلى Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "master"
   - اضغط Save

5. سيكون الموقع متاحاً على:
   `https://lifemakersclubit-art.github.io/CAMP_ITUELM/`

---

## الخطوة 4: اختبار النظام

### اختبار التحقق من الرقم القومي
1. افتح صفحة التسجيل
2. أدخل رقم قومي موجود في تبويب **FULL DATA** → تأكد من دخول استمارة الكامب
3. أدخل رقم قومي موجود في تبويب **REG فقط** → تأكد من ظهور استمارة الضبط (jIIg4IEe)
4. أدخل رقم قومي موجود في تبويب **جذب** → تأكد من دخول استمارة الكامب
5. أدخل رقم قومي غير موجود → سؤال "هل أنت متطوع بالفعل؟"
6. اضغط "نعم" → يظهر رابط استمارة الضبط (jIIg4IEe)
7. اضغط "لا" → يظهر رابط الجذب (lnXsKATT)

### اختبار التسجيل
1. املأ جميع الحقول في الخطوات الـ 7
2. اضغط "إرسال التسجيل"
3. تأكد من ظهور شاشة النجاح
4. افتح شيت Camp Registration وتأكد من حفظ البيانات
5. تأكد من استلام بريد ترحيبي

### اختبار التخزين المحلي
أُزيلت ميزة التخزين المحلي — بيانات التسجيل تُرسل مباشرة بدون حفظ محلي.

### اختبار التكرار
1. حاول التسجيل بنفس الرقم القومي مرة أخرى
2. تأكد من ظهور رسالة "لقد قمت بالتسجيل بالفعل"

---

## إضافة لجان جديدة

فقط أضف صفاً جديداً في تبويب `Committees`:

| A |
|---|
| اللجنة الجديدة |

سيظهر التراك تلقائياً في واجهة المستخدم.

## إضافة مهارات للجان

أضف صفوفاً في تبويب `Committee Skills`:

| Committee | Skill |
|---|---|
| اللجنة الجديدة | مهارة جديدة |

## إضافة احتياجات تدريبية

أضف صفوفاً في تبويب `Training Needs`:

| Category | Need |
|---|---|
| التصنيف | الاحتياج الجديد |

**لا حاجة لتعديل أي كود عند إضافة لجان أو مهارات أو احتياجات.**

---

## ملاحظات تقنية

- **الأمان:** يُستخدم `LockService` لمنع تضارب الكتابة عند التسجيل المتزامن
- **منع التكرار:** يتم فحص التكرار داخل القفل، والتحقق من الرقم القومي قبل الحفظ
- **البريد الإلكتروني:** يتم إرسال بريد ترحيبي تلقائياً بعد التسجيل بنجاح، ولا يُرسل إلا لمن سجّل فعلاً
- **الأمان ضد الصيغ:** تُحوَّل القيم التي تبدأ بـ `= + - @` إلى نص لمنع Formula Injection
- **الاسم الكامل:** يجب أن يكون 4 كلمات على الأقل
- **التوافق:** يعمل على جميع الأجهزة (محمول، تابلت، كمبيوتر)

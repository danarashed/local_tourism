# Local Tourism Jordan – Firestore Structure

4 collections فقط: `users` · `destinations` · `reviews` · `trips`
كل الفريق لازم يستخدم نفس الأسماء بالضبط.

## users  (document id = uid من Firebase Auth)
| field | type | note |
|---|---|---|
| name | string | |
| email | string | |
| points | number | يبدأ 0 |
| role | string | `"user"` أو `"admin"` |
| profileImage | string | اختياري |
| createdAt | timestamp | |

> لعمل أدمن: من Firestore Console غيّري `role` إلى `admin` بوثيقة المستخدم.
> المستوى (Level) يُحسب بالكود من النقاط، ما بنخزنه.
> عدد المراجعات/الصور بالبروفايل بيتحسب بـ query على `reviews`.

## destinations
| field | type | note |
|---|---|---|
| name | string | |
| description | string | |
| category | string | `history` `nature` `adventure` `beaches` `food` `hidden` |
| location | string | |
| image | string | مثال `images/petra.jpg` |
| rating | number | |
| createdAt | timestamp | |

حقول إضافية مطلوبة من التصميم (صفحة Petra والخريطة): `lat`, `lng`, `bestTime`, `entryFee`, `duration`, `difficulty`, `featured` (boolean لـ Trending بالرئيسية).

## reviews
| field | type | note |
|---|---|---|
| userId | string | uid |
| destinationId | string | id الوجهة |
| rating | number | 1–5 |
| comment | string | |
| image | string | اختياري |
| status | string | `pending` أو `approved` |
| createdAt | timestamp | |

نسخ للعرض فقط: `userName` و`destinationName` (بنخزنهم مع الـ ids عشان جدول الأدمن والكومنتي ما يحتاجوا query إضافي لكل مراجعة). المرجع الأساسي دايمًا `userId` و`destinationId`.

## trips  (لصفحة Plan Your Trip)
| field | type | note |
|---|---|---|
| userId | string | uid |
| days | number | 3 / 5 / 7 / 10 |
| interests | array | مثل `["Historical Sites","Desert Adventures"]` |
| preferences | array | مثل `["Petra & Wadi Rum"]` |
| style | string | Budget Friendly / Mid-Range Comfort / Luxury Experience / Backpacker |
| destinations | array | ids الوجهات **بترتيب المحطات** (My Trip Route) |
| createdAt | timestamp | |

الحفظ: زر "View My Plan" بيعمل `addDoc` بـ trips. عرض الرحلات: `where("userId","==",uid)`.

## العلاقات
users → reviews → destinations
(المراجعة فيها userId و destinationId)

## النقاط (اتفقوا على رقم واحد)
- مراجعة: **+20**
- صورة: **+10**
استخدموا `increment()` لتحديث `points` بوثيقة المستخدم.

## Popular Experiences (صفحة Categories)
ما في collection إلها. بنعرض أعلى الوجهات تقييمًا (`orderBy("rating", "desc")`).

## توزيع الشغل
| الشخص | المهام |
|---|---|
| 1 | Home، Destinations، Categories، Destination Details، Search/Filter |
| 2 | الأساس المشترك (CSS/navbar/footer) ← Login، Signup، Profile، Logout، Plan Your Trip |
| 3 | Share Experience، Reviews، Points، Leaderboard، Community |
| 4 | Admin (Dashboard، Destinations، Reviews)، Map، About |

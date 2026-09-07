# 🇧🇩 Discover Good People of Bangladesh

একটি প্ল্যাটফর্ম যার মাধ্যমে বাংলাদেশের বিভিন্ন প্রান্তের ভালো মানুষ, ইতিবাচক উদ্যোগ এবং সামাজিক কাজের তথ্য সংগ্রহ ও প্রদর্শন করা হয়।

## 📌 প্রজেক্ট ওভারভিউ (Project Overview)

এই প্রজেক্টটি দুটি মূল অংশে বিভক্ত:

1. *মনোনয়ন ফর্ম (nominate.html):* সাধারণ ব্যবহারকারীরা যেকোনো ভালো মানুষ বা সমাজসেবামূলক উদ্যোগের তথ্য সাবমিট করতে পারবেন।
2. *লাইভ মনিটরিং ড্যাশবোর্ড (index.html):* সংগৃহীত সব তথ্য সরাসরি রিয়েল-টাইমে ওয়েবসাইটে ড্যাশবোর্ড/কার্ড আকারে প্রদর্শিত হবে।

---

## 🛠️ সিস্টেম আর্কিটেকচার (System Architecture)

* *Frontend:* HTML, CSS, JavaScript (Cloudflare Pages-এ হোস্ট করা)
* *Backend Data Storage:* Google Sheets
* *Deployment Links:*
  * *Nomination Form:* https://white-boat-9499.workers.dev
  * *Monitoring Dashboard:* https://weathered-leaf-479c.workers.dev

---

## 📁 প্রজেক্ট ডিরেক্টরি (Project Structure)

```text
.
├── index.html       # মনিটরিং ড্যাশবোর্ড (ডাটা লাইভ প্রদর্শনের জন্য)
├── nominate.html    # মনোনয়ন ইনপুট ফর্ম (তথ্য সংগ্রহের জন্য)
└── README.md        # প্রজেক্ট গাইডলাইন ও ডকুমেন্টেশন

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export function requireAdmin() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();

            // مش مسجل دخول
            if (!user) {
                window.location.href = "../login.html";
                return;
            }

            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                if (snap.exists() && snap.data().role === "admin") {
                    resolve(user);          // أدمن: كملي
                    return;
                }
            } catch (error) {
                console.error("Admin check failed:", error);
            }

            // مسجل بس مش أدمن
            alert("This area is for administrators only.");
            window.location.href = "../index.html";
        });
    });
}

// يمنع إدخال HTML من نصوص المستخدمين (مثل التعليقات)
export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

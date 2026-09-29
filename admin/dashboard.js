import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where
} from
"https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// ==============================
// ELEMENTS
// ==============================

const destinationCount =
    document.getElementById("destinationCount");

const reviewCount =
    document.getElementById("reviewCount");

const pendingCount =
    document.getElementById("pendingCount");

const newDestinationCount =
    document.getElementById("newDestinationCount");

const pendingBadge =
    document.getElementById("pendingBadge");

const destinationsList =
    document.getElementById("destinationsList");

const reviewsList =
    document.getElementById("reviewsList");


// ==============================
// CHECK ADMIN LOGIN
// ==============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "../login.html";

        return;
    }

    // لاحقًا نضيف هنا فحص role = admin

    await loadDashboard();

});


// ==============================
// LOAD DASHBOARD
// ==============================

async function loadDashboard() {

    try {

        await loadDestinations();

        await loadReviews();

    }

    catch (error) {

        console.error("Dashboard error:", error);

    }

}


// ==============================
// DESTINATIONS
// ==============================

async function loadDestinations() {

    const destinationsRef =
        collection(db, "destinations");


    const snapshot =
        await getDocs(destinationsRef);


    // Total destinations

    destinationCount.textContent =
        snapshot.size;


    // Recent destinations

    const recentQuery = query(
        destinationsRef,
        orderBy("createdAt", "desc"),
        limit(4)
    );


    const recentSnapshot =
        await getDocs(recentQuery);


    destinationsList.innerHTML = "";

    newDestinationCount.textContent =
        recentSnapshot.size + " new";


    if (recentSnapshot.empty) {

        destinationsList.innerHTML =
            `<div class="loading">
                No destinations found.
            </div>`;

        return;
    }


    recentSnapshot.forEach((doc) => {

        const destination = doc.data();

        const name =
            destination.name || "Unnamed destination";

        const category =
            destination.category || "General";

        const location =
            destination.location || "Jordan";

        const image =
            destination.image ||
            "https://via.placeholder.com/80";


        destinationsList.innerHTML += `

            <div class="destination-item">

                <img
                    class="destination-image"
                    src="${image}"
                    alt="${name}"
                >

                <div class="destination-info">

                    <h4>${name}</h4>

                    <p>${location}</p>

                </div>

                <span class="category">
                    ${category}
                </span>

                <div>

                    <div class="destination-date">
                        Published
                    </div>

                    <div class="destination-status">
                        ● Published
                    </div>

                </div>

            </div>

        `;

    });

}


// ==============================
// REVIEWS
// ==============================

async function loadReviews() {

    const reviewsRef =
        collection(db, "reviews");


    const allReviews =
        await getDocs(reviewsRef);


    // Total reviews

    reviewCount.textContent =
        allReviews.size;


    // Pending reviews

    const pendingQuery = query(
        reviewsRef,
        where("status", "==", "pending")
    );


    const pendingSnapshot =
        await getDocs(pendingQuery);


    pendingCount.textContent =
        pendingSnapshot.size;


    pendingBadge.textContent =
        pendingSnapshot.size + " pending";


    // Recent reviews

    const recentQuery = query(
        reviewsRef,
        orderBy("createdAt", "desc"),
        limit(4)
    );


    const recentSnapshot =
        await getDocs(recentQuery);


    reviewsList.innerHTML = "";


    if (recentSnapshot.empty) {

        reviewsList.innerHTML =
            `<div class="loading">
                No reviews found.
            </div>`;

        return;
    }


    recentSnapshot.forEach((doc) => {

        const review = doc.data();

        const userName =
            review.userName || "User";

        const destination =
            review.destinationName || "Destination";

        const comment =
            review.comment || "";

        const rating =
            review.rating || 0;

        const status =
            review.status || "pending";


        const initials =
            getInitials(userName);


        reviewsList.innerHTML += `

            <div class="review-item">

                <div class="review-top">

                    <div class="review-avatar">
                        ${initials}
                    </div>

                    <div class="review-user">

                        <strong>
                            ${userName}
                        </strong>

                        <span>
                            Traveler
                        </span>

                    </div>

                    <span class="review-time">
                        Recent
                    </span>

                </div>


                <div class="review-destination">
                    ${destination}
                </div>


                <div class="review-comment">
                    ${comment}
                </div>


                <div class="review-bottom">

                    <span class="rating">
                        ☆ ${rating}
                    </span>

                    <span class="status ${status}">
                        ${status.toUpperCase()}
                    </span>

                </div>

            </div>

        `;

    });

}


// ==============================
// GET INITIALS
// ==============================

function getInitials(name) {

    const words =
        name.trim().split(" ");


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ==============================
// LOGOUT
// ==============================

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href =
                "../login.html";

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    });
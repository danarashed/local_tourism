import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// import {
//     onAuthStateChanged,
//     signOut
// } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// ========================================
// HTML ELEMENTS
// ========================================

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


// ========================================
// CHECK LOGIN
// ========================================

import { requireAdmin, escapeHtml } from "../js/admin-guard.js";

await requireAdmin();
await loadDashboard();


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    try {

        await loadDestinations();

        await loadReviews();

    } catch (error) {

        console.error("Dashboard error:", error);

        destinationsList.innerHTML =
            `<div class="loading">
                Could not load destinations.
            </div>`;

        reviewsList.innerHTML =
            `<div class="loading">
                Could not load reviews.
            </div>`;
    }
}


// ========================================
// LOAD DESTINATIONS
// ========================================

async function loadDestinations() {

    const snapshot =
        await getDocs(
            collection(db, "destinations")
        );


    // Total destinations

    destinationCount.textContent =
        snapshot.size;


    // Convert Firestore documents to array

    const destinations = [];

    snapshot.forEach((doc) => {

        destinations.push({
            id: doc.id,
            ...doc.data()
        });

    });


    // Sort by createdAt - newest first

    destinations.sort((a, b) => {

        const timeA =
            a.createdAt?.toMillis?.() || 0;

        const timeB =
            b.createdAt?.toMillis?.() || 0;

        return timeB - timeA;

    });


    // Show number of destinations
    // in the small badge

    newDestinationCount.textContent =
        destinations.length + " total";


    // Clear loading message

    destinationsList.innerHTML = "";


    // Show only latest 4

    const recentDestinations =
        destinations.slice(0, 4);


    if (recentDestinations.length === 0) {

        destinationsList.innerHTML =
            `<div class="loading">
                No destinations found.
            </div>`;

        return;
    }


    recentDestinations.forEach((destination) => {

        const name =
            destination.name || "Unnamed destination";

        const location =
            destination.location || "Jordan";

        const category =
            destination.category || "General";

        /*
            The seed currently stores:

            image: "images/petra.jpg"

            This is a path, not an actual image URL.
            Therefore we don't use it as src yet.
        */

        destinationsList.innerHTML += `

            <div class="destination-item">

                <div class="destination-image-placeholder">
                    ${getDestinationIcon(destination.category)}
                </div>

                <div class="destination-info">

                    <h4>
                        ${name}
                    </h4>

                    <p>
                        ${location}
                    </p>

                </div>

                <span class="category">
                    ${capitalize(category)}
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


// ========================================
// LOAD REVIEWS
// ========================================

async function loadReviews() {

    const snapshot =
        await getDocs(
            collection(db, "reviews")
        );


    // Total reviews

    reviewCount.textContent =
        snapshot.size;


    // Convert documents to array

    const reviews = [];

    snapshot.forEach((doc) => {

        reviews.push({
            id: doc.id,
            ...doc.data()
        });

    });


    // Count pending reviews

    const pendingReviews =
        reviews.filter(
            review => review.status === "pending"
        );


    pendingCount.textContent =
        pendingReviews.length;

    pendingBadge.textContent =
        pendingReviews.length + " pending";


    // Sort newest first

    reviews.sort((a, b) => {

        const timeA =
            a.createdAt?.toMillis?.() || 0;

        const timeB =
            b.createdAt?.toMillis?.() || 0;

        return timeB - timeA;

    });


    // Clear loading

    reviewsList.innerHTML = "";


    // Latest 4 reviews

    const recentReviews =
        reviews.slice(0, 4);


    if (recentReviews.length === 0) {

        reviewsList.innerHTML =
            `<div class="loading">
                No reviews found.
            </div>`;

        return;
    }


    recentReviews.forEach((review) => {

        const userName =
            review.userName || "User";

        const destinationName =
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
                    ${destinationName}
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


// ========================================
// GET USER INITIALS
// ========================================

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


// ========================================
// DESTINATION ICON
// ========================================

function getDestinationIcon(category) {

    if (category === "history") {
        return "🏛";
    }

    if (category === "nature") {
        return "🌿";
    }

    if (category === "adventure") {
        return "🏜";
    }

    if (category === "beaches") {
        return "🌊";
    }

    return "📍";
}


// ========================================
// CAPITALIZE CATEGORY
// ========================================

function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href =
                "../login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    });
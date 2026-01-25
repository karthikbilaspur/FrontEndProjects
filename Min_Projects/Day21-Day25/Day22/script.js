const usernameInput = document.getElementById('username');
const searchBtn = document.getElementById('search-btn');
const profileDiv = document.getElementById('profile');
const repoList = document.getElementById('repo-list');
const followerList = document.getElementById('follower-list');
const followingList = document.getElementById('following-list');
const socialMediaLinks = document.getElementById('social-media-links');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMsg = document.getElementById('error-msg');

searchBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username) {
        loadingIndicator.style.display = 'block';
        errorMsg.textContent = '';
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            if (data.message === 'Not Found') {
                errorMsg.textContent = 'User not found.';
                profileDiv.innerHTML = '';
                repoList.innerHTML = '';
                followerList.innerHTML = '';
                followingList.innerHTML = '';
                socialMediaLinks.innerHTML = '';
            } else {
                displayProfile(data);
                await fetchRepos(data.repos_url);
                await fetchFollowers(data.followers_url);
                await fetchFollowing(data.following_url);
            }
        } catch (error) {
            errorMsg.textContent = 'Error fetching data.';
            console.error(error);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
});

async function fetchRepos(reposUrl) {
    try {
        const response = await fetch(reposUrl);
        const data = await response.json();
        repoList.innerHTML = '';
        data.forEach(repo => {
            const repoHtml = `
                <li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <p>${repo.description || 'No description'}</p>
                </li>
            `;
            repoList.innerHTML += repoHtml;
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchFollowers(followersUrl) {
    try {
        const response = await fetch(followersUrl);
        const data = await response.json();
        followerList.innerHTML = '';
        data.forEach(follower => {
            const followerHtml = `
                <li>
                    <a href="${follower.html_url}" target="_blank">${follower.login}</a>
                </li>
            `;
            followerList.innerHTML += followerHtml;
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchFollowing(followingUrl) {
    try {
        const response = await fetch(followingUrl);
        const data = await response.json();
        followingList.innerHTML = '';
        data.forEach(following => {
            const followingHtml = `
                <li>
                    <a href="${following.html_url}" target="_blank">${following.login}</a>
                </li>
            `;
            followingList.innerHTML += followingHtml;
        });
    } catch (error) {
        console.error(error);
    }
}

function displayProfile(data) {
    const profileHtml = `
        <div class="profile-card">
            <img src="${data.avatar_url}" alt="${data.login}">
            <h2>${data.name || data.login}</h2>
            <p>${data.bio || 'No bio available'}</p>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}</p>
            <a href="${data.html_url}" target="_blank">View GitHub Profile</a>
        </div>
    `;
    profileDiv.innerHTML = profileHtml;
}
export function fetchData(username) {
    return fetch("/api/v1/" + username).then(res => res.json());
}

export function cleanUsername(username) {
    return username.replace(/^(http|https):\/\/(?!www\.)github\.com\//, '');
}
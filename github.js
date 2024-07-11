export class GitHubFavorite{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(dadosEncontrados => dadosEncontrados.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}
import { GitHubFavorite } from "./github.js"

export class Favorite{
    constructor(root){
        this.app = document.querySelector(root)
        this.carregarDados()
    }

    carregarDados(){
        this.entradaDados = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entradaDados))
    }

    async add(username){
        try{
            const userExist = this.entradaDados.find(entrada => entrada.login === username)

            if(userExist){
                throw new Error('Favorito já cadastrado!')
            }

            const user = await GitHubFavorite.search(username)

            if(user.login === undefined){
                throw new Error('Usuário não encontrado! Confira o username!')
            }

            this.entradaDados = [user, ...this.entradaDados]
            this.update()
            this.save()
            window.location.reload()

        } catch(error){
            alert(error.message)
        }

    }

    deletar(user){
        const filtrarEntradas = this.entradaDados.filter(entrada => entrada.login !== user.login)

        this.entradaDados = filtrarEntradas
        this.update()
        this.save()
    }
}

export class FavoriteView extends Favorite{
    constructor(root) {
        super(root)

        this.tbody = this.app.querySelector('#corpoTabela')

        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.app.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.app.querySelector('.search input')

            this.add(value)

            
        }
    }

    update(){
        this.entradaDados.forEach( usuario => {
            const cadaLinha = this.criarLinha()

            cadaLinha.querySelector('.user img').src = `https://github.com/${usuario.login}.png`
            cadaLinha.querySelector('.user img').alt = `Imagem do perfil ${usuario.name}`
            cadaLinha.querySelector('.user a').href = `http://github.com/${usuario.login}`
            cadaLinha.querySelector('.user p').textContent = `${usuario.name}`
            cadaLinha.querySelector('.user span').textContent = `${usuario.login}`
            cadaLinha.querySelector('.repositories').textContent = `${usuario.public_repos}`
            cadaLinha.querySelector('.followers').textContent = `${usuario.followers}`

            cadaLinha.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja remover este favorito?')
                if(isOk){
                    this.deletar(usuario)
                    window.location.reload()
                }
            }

            this.tbody.append(cadaLinha)
        })
    }


    criarLinha () {
        const linhaTabela = document.createElement('tr')

        linhaTabela.innerHTML = `
            <td class="user">
                <img src="" alt="">
                <a href="">
                    <p></p>
                    <span></span>
                </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td><button class="remove">Remover</button></td>
        `

        return linhaTabela
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
}


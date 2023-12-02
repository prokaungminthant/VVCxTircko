exports.pageload = () => {
    let box = document.getElementsByClassName("sc-eldieg")[0];
    let newHTML = `
    <a class="discordLogin" href="https://voxiom.io/auth/discord2">Sign in with Discord</a>
    <a class="googleLogin" href="https://voxiom.io/auth/google2">Sign in with Google</a>
    <a class="fbLogin" href="https://voxiom.io/auth/facebook2">Sign in with Facebook</a>`
    box.innerHTML = newHTML;

}
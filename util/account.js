exports.pageload = () => {
    let box = document.getElementsByClassName("sc-eldieg")[0];
    let newHTML = `
    <a class="discordLogin" href="https://voxiom.io/auth/discord">Sign in with Discord</a>
    <a class="googleLogin" href="https://voxiom.io/auth/google">Sign in with Google</a>
    <a class="fbLogin" href="https://voxiom.io/auth/facebook">Sign in with Facebook</a>`
    box.innerHTML = newHTML;
}
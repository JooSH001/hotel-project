class MyFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const footer = document.createElement('footer');
        footer.classList.add('footer');

        footer.innerHTML = `
            <div class="footer-inner">
                <div class="logo">H</div>
                <div class="sns">
                    <i class="fa-brands fa-instagram"></i>
                    <i class="fa-brands fa-facebook"></i>
                    <i class="fa-brands fa-youtube"></i>
                </div>
                <div class="info">
                    경기 성남시 분당구 황새울로329번길 5 한국폴리텍대학 융합기술교육원<br>
                    사업자등록번호 000-00-0000 &nbsp;&nbsp;&nbsp;&nbsp; 전화 012-345-6789 &nbsp;&nbsp;&nbsp;&nbsp; 팩스 01-234-5678
                </div>
                <div class="links">
                    <a href="#">이용약관</a>&nbsp;&nbsp;<a href="#">개인정보처리방침</a>
                </div>
                <div class="copy">Copyright © 2025 예약연습 All rights reserved.</div>
            </div>
            <div class="top-btn" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });">⬆</div>
        `;

        this.appendChild(footer);
    }
}

customElements.define('my-footer', MyFooter);

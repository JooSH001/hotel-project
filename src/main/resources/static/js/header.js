class MyHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const header = document.createElement('header');
        header.classList.add('header');

        header.innerHTML = `
            <div class="logo"><a href="index.html">H</a></div>
            <nav class="nav">
                <ul class="menu">
                    <li>
                        ABOUT
                        <ul class="submenu">
                            <li>호텔 소개</li>
                            <li>오시는길</li>
                        </ul>
                    </li>
                    <li>
                        ROOMS
                        <ul class="submenu">
                            <li>ROOM 1</li>
                            <li>ROOM 2</li>
                            <li>ROOM 3</li>
                        </ul>
                    </li>
                    <li>
                        RESERVATION
                        <ul class="submenu">
                            <li><a href="reserpage_1.html" class="sms">예약안내</a></li>
                            <li><a href="reserpage_2.html" class="sms">실시간예약</a></li>
                        </ul>
                    </li>
                    <li>
                        COMMUNITY
                        <ul class="submenu">
                            <li>공지사항</li>
                            <li>이벤트</li>
                            <li>FAQ</li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div class="header-submenu-row"></div>
        `;

        this.appendChild(header);

        const menuItems = header.querySelectorAll('.menu > li');
        const submenuRow = header.querySelector('.header-submenu-row');

        function applyHeaderMode() {
            const isMobile = window.innerWidth <= 1000;

            menuItems.forEach(li => {
                li.onmouseenter = null;
                li.onmouseleave = null;
                li.onclick = null;
                li.classList.remove('selected', 'open');
            });
            submenuRow.innerHTML = '';
            submenuRow.style.display = 'none';

            if (!isMobile) {
                menuItems.forEach(li => {
                    li.addEventListener('mouseenter', function () {
                        menuItems.forEach(item => item.classList.remove('open'));
                        li.classList.add('open');
                    });
                    li.addEventListener('mouseleave', function () {
                        li.classList.remove('open');
                    });
                });
            } else {
                menuItems.forEach((li, idx) => {
                    li.addEventListener('click', function (e) {
                        e.stopPropagation();
                        menuItems.forEach(item => item.classList.remove('selected'));
                        li.classList.add('selected');

                        const submenu = li.querySelector('.submenu');
                        if (submenu) {
                            let html = '';
                            submenu.querySelectorAll('li').forEach((sli, i, arr) => {
                                html += `<span>${sli.innerHTML}</span>`;
                            });
                            submenuRow.innerHTML = html;
                            submenuRow.style.display = 'flex';
                        } else {
                            submenuRow.innerHTML = '';
                            submenuRow.style.display = 'none';
                        }
                    });
                });
            }
        }

        function globalClickHandler() {
            const isMobile = window.innerWidth <= 1000;
            if (!isMobile) {
                document.addEventListener('click', closeAllMenu);
            } else {
                document.removeEventListener('click', closeAllMenu);
            }
        }

        function closeAllMenu() {
            menuItems.forEach(item => item.classList.remove('selected', 'open'));
            submenuRow.innerHTML = '';
            submenuRow.style.display = 'none';
        }

        function openReservationIfNeeded() {
            const path = window.location.pathname;
            if (path.includes('reserpage_1') || path.includes('reserpage_2')) {
                const reservationLi = Array.from(menuItems).find(li => li.textContent.includes('RESERVATION'));
                if (!reservationLi) return;

                if (window.innerWidth > 1000) {
                    reservationLi.classList.add('open');
                } else {
                    reservationLi.classList.add('selected');
                    const submenu = reservationLi.querySelector('.submenu');
                    let html = '';
                    submenu.querySelectorAll('li').forEach((sli, i, arr) => {
                        html += `<span>${sli.innerHTML}</span>`;
                    });
                    submenuRow.innerHTML = html;
                    submenuRow.style.display = 'flex';
                }
            }
        }

        applyHeaderMode();
        globalClickHandler();
        openReservationIfNeeded();

        window.addEventListener('resize', () => {
            applyHeaderMode();
            globalClickHandler();
            openReservationIfNeeded();
        });
    }
}

customElements.define('my-header', MyHeader);

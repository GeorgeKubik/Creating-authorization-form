
window.addEventListener('DOMContentLoaded', () => {
	'use strict';
	const form = document.querySelector('.auth__form');
	const inputForm = document.querySelectorAll('.auth__input');
	const errorMessage = document.querySelector('.auth__form__message');
	const container = document.querySelector('.auth__container');
	const login = document.querySelector('input[name="login"]');

	/* Обработка инпута на тип данных */

	login.addEventListener('input', (e) => {
		const type = e.target.value.includes('@') ? 'email' : 'tel';
		login.setAttribute("type", type);
	});

	/* Обработка полученных данных от клиента */
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		errorMessage.innerHTML = '';
		inputForm.forEach(item => item.classList.remove('auth__input-error'));

		const formData = new FormData(form);

		const object = {};
		for (const key of formData.entries()) {
			object[key[0]] = key[1];
		}

		let searchParams = new URLSearchParams(object);
		let url = new URL('https://test-works.pr-uni.ru/api/login/index.php');
		url.search = searchParams.toString();

		let statusMessage = document.createElement('div');
		statusMessage.innerHTML = 'Loading...';
		statusMessage.classList.add('status-message');
		container.append(statusMessage);

		let success = document.createElement('div');
		success.classList.add('auth-people');

		for (const child of form.children) {
			if (child.tagName.toLowerCase() === 'fieldset') {
				child.disabled = true;
			}
		}

		/* Запрос на сервер */

		const res = await fetch(url.toString(), {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=UTF-8"
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.satus === 'ok') {
					inputForm.forEach(item => item.classList.remove('auth__input-error'));
					container.style = 'display: none';
					success.innerHTML = `${data.user.name}, Вы успешно авторизованы!`;
					document.cookie = `token=${data.token}`;
					form.append(success);
				} else {
					inputForm.forEach(item => item.classList.add('auth__input-error'));
					container.style = 'display: flex'
					errorMessage.innerHTML = message.errorMessage;
				}
			}).catch(() => {
				errorMessage.innerHTML = 'Ошибка сервера';
			}).finally(() => {
				statusMessage.style = 'display: none';
				for (const child of form.children) {
					if (child.tagName.toLowerCase() === 'fieldset') {
						child.disabled = false;
					}
				}
			});
		return res;
	})

});
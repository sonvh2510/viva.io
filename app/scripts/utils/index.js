import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';

const getSvg = () => {
	const svgs = Array.from(document.querySelectorAll('.isSVG'));
	svgs.forEach((svgParent) => {
		const img = svgParent.querySelector('.svg');
		const url = img.getAttribute('src');
		fromFetch(url)
			.pipe(
				switchMap((response) => {
					if (response.ok) {
						// OK return data
						return response.text();
					} else {
						// Server is returning a status requiring the client to try something else.
						return of({
							error: true,
							message: `Error ${response.status}`,
							status: response.status,
						});
					}
				}),
				catchError((err) => {
					// Network or other error, handle appropriately
					console.error(err);
					return of({
						error: true,
						message: err.message,
						status: err.status,
					});
				}),
			)
			.subscribe((res) => {
				svgParent.innerHTML = res;
			});
		// const svgContent = HTTP.get(url).subscribe((response) => {
		// 	console.log(response);
		// });
	});
};

const dropdownToggle = () => {
	$('.dropdown').each(function () {
		const label = $(this).find('.dropdown__label');
		const list = $(this).find('.dropdown__list');
		label.on('click', function () {
			$(this).toggleClass('is-expanded');
			label.toggleClass('active');
			list.toggleClass('active');
			list.slideToggle('fast');
		});
	});
};

class Tab {
	constructor(selector, obj) {
		this.options = {};
		this.selector = document.querySelector(selector);
		if (this.selector) {
			this.navigationItems = Array.from(
				this.selector.querySelectorAll('[toggle-for]'),
			);
			this.contentList = Array.from(
				this.selector.querySelectorAll('[tab-id]'),
			);
			this.hideAllContent();
			this.init();
		} else {
			console.log("Không có selector kìa");
		}
	}

	hideAllContent() {
		console.log(this.contentList);
		this.contentList.forEach((content) => {
			content.style.display = 'none';
		});
	}

	runTabWhenClicked() {
		this.navigationItems.forEach((element, index) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const tabTarget = element.attributes['toggle-for'].value;
				const targetDOM = Array.from(
					this.selector.querySelectorAll(`[tab-id='${tabTarget}']`),
				);
				Array.from(this.navigationItems).forEach(
					(eleClicked, eleClickedIndex) => {
						if (eleClickedIndex != index) {
							eleClicked.classList.remove('active');
						}
					},
				);
				Array.from(this.contentList).forEach((tabContentElement) => {
					if (
						tabContentElement.attributes['tab-id'].value !=
						tabTarget
					) {
						tabContentElement.style.display = 'none';
						tabContentElement.classList.remove('show');
					}
				});
				element.classList.add('active');
				targetDOM.forEach((item) => {
					item.style.display = 'block';
				});
				setTimeout(() => {
					targetDOM.forEach((item) => {
						item.classList.add('show');
					});
				}, 50);
			});
		});
	}

	activeFirstTab() {
		this.navigationItems[0].click();
	}

	selectHandler(select) {
		select.addEventListener('change', (e) => {
			document
				.querySelector(`[toggle-for=${e.srcElement.value}]`)
				.click();
		});
	}

	runResponsive() {
		const createSelectOption = (navigationItems) => {
			let newTabSelect = document.createElement('select');
			navigationItems.forEach((item) => {
				let newTabSelectOptionItem = document.createElement('option');
				newTabSelectOptionItem.setAttribute(
					'value',
					item.getAttribute('toggle-for'),
				);
				newTabSelectOptionItem.innerHTML = item.innerHTML;
				newTabSelect.appendChild(newTabSelectOptionItem);
			});
			this.selectHandler(newTabSelect);
			return newTabSelect;
		};

		const addOrRemoveSelect = (bp) => {
			const selectResponse = createSelectOption(this.navigationItems);
			if (bp.matches) {
				this.navigationList.appendChild(selectResponse);
				this.navigationItems.forEach((item) => {
					item.setAttribute('style', 'display: none!important');
				});
			} else {
				if (this.navigationList.querySelector('select')) {
					this.navigationList
						.querySelector('select')
						.parentNode.removeChild(
							this.navigationList.querySelector('select'),
						);
					this.navigationItems.forEach((item) => {
						item.removeAttribute('style');
					});
				}
			}
		};

		if (this.options) {
			if (this.isResponsive) {
				const bp = window.matchMedia(
					`(max-width: ${this.breakpoint}px)`,
				);
				addOrRemoveSelect(bp);
				bp.addListener(addOrRemoveSelect);
			}
		}
	}

	init() {
		this.runTabWhenClicked();
		this.activeFirstTab();
		this.runResponsive();
	}
}
export { getSvg, dropdownToggle, Tab };

import { CSSProperties } from 'react';

function Value({
	fillColor,
}: {
	fillColor: CSSProperties['color'];
}): JSX.Element {
	return (
		// <svg
		// 	width="68"
		// 	height="48"
		// 	viewBox="0 0 68 48"
		// 	fill="none"
		// 	xmlns="http://www.w3.org/2000/svg"
		// >
		// 	<path
		// 		d="M0 5.914V42.086C0 43.6542 0.62289 45.1585 1.73183 46.2675C2.84078 47.3771 4.34511 48 5.91329 48H61.5019C63.0701 48 64.5744 47.3771 65.6834 46.2675C66.7923 45.1585 67.4152 43.6542 67.4152 42.086V5.914C67.4152 4.34578 66.7923 2.84152 65.6834 1.73253C64.5744 0.623576 63.0701 0 61.5019 0H5.91329C4.34508 0 2.84082 0.623576 1.73183 1.73253C0.622872 2.84149 0 4.34581 0 5.914ZM63.4735 5.914V42.086C63.4735 42.6092 63.2659 43.1104 62.896 43.4803C62.5261 43.8495 62.0249 44.0571 61.5024 44.0571H5.91382C4.82549 44.0571 3.94277 43.175 3.94277 42.086V5.91403C3.94277 4.8257 4.82553 3.94298 5.91382 3.94298H61.5024C62.0249 3.94298 62.5261 4.15061 62.896 4.52048C63.2659 4.88968 63.4735 5.39148 63.4735 5.914Z"
		// 		fill="#1554AD"
		// 	/>
		// 	<path
		// 		d="M13.7695 17.668C10.1016 17.668 7.48828 20.1758 7.48828 23.6094V23.6328C7.48828 26.8438 9.76172 29.2109 13.0078 29.2109C15.3281 29.2109 16.8047 28.0273 17.4258 26.6914H17.6602C17.6602 26.8203 17.6484 26.9492 17.6484 27.0781C17.5195 30.3125 16.3828 32.9375 13.6992 32.9375C12.2109 32.9375 11.168 32.1641 10.7227 30.9805L10.6875 30.8633H7.71094L7.73438 30.9922C8.27344 33.582 10.5938 35.4219 13.6992 35.4219C17.9531 35.4219 20.5195 32.0469 20.5195 26.3516V26.3281C20.5195 20.2344 17.3789 17.668 13.7695 17.668ZM13.7578 26.8906C11.8359 26.8906 10.4414 25.4844 10.4414 23.5273V23.5039C10.4414 21.6172 11.9297 20.1289 13.793 20.1289C15.668 20.1289 17.1328 21.6406 17.1328 23.5742V23.5977C17.1328 25.5078 15.668 26.8906 13.7578 26.8906ZM24.832 35.2344C25.9102 35.2344 26.6953 34.4258 26.6953 33.3828C26.6953 32.3398 25.9102 31.5312 24.832 31.5312C23.7656 31.5312 22.9688 32.3398 22.9688 33.3828C22.9688 34.4258 23.7656 35.2344 24.832 35.2344ZM37.8633 35H40.7578V31.7539H43.0312V29.2578H40.7578V18.0898H36.4805C34.1836 21.582 31.7812 25.4727 29.5898 29.2812V31.7539H37.8633V35ZM32.4023 29.3281V29.1523C34.043 26.2812 36 23.1523 37.7344 20.5039H37.9102V29.3281H32.4023ZM52.6406 35.4219C56.3086 35.4219 58.9219 32.9141 58.9219 29.4805V29.457C58.9219 26.2461 56.6484 23.8789 53.4023 23.8789C51.082 23.8789 49.6055 25.0625 48.9844 26.3984H48.75C48.75 26.2695 48.7617 26.1406 48.7617 26.0117C48.8906 22.7773 50.0273 20.1523 52.7109 20.1523C54.1992 20.1523 55.2422 20.9258 55.6875 22.1094L55.7344 22.2266H58.6992L58.6758 22.0977C58.1367 19.5078 55.8164 17.668 52.7109 17.668C48.457 17.668 45.8906 21.043 45.8906 26.7383V26.7617C45.8906 32.8555 49.0312 35.4219 52.6406 35.4219ZM49.2773 29.5156V29.4922C49.2773 27.582 50.7422 26.1992 52.6523 26.1992C54.5742 26.1992 55.9688 27.6055 55.9688 29.5625V29.5859C55.9688 31.4727 54.4922 32.9609 52.6172 32.9609C50.7422 32.9609 49.2773 31.4492 49.2773 29.5156Z"
		// 		fill="#1668DC"
		// 	/>
		// </svg>
		<svg
			width="30"
			height="30"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V9M9 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V9M9 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill={fillColor}
			/>
			<path
				d="M9.76562 15.6221C9.19922 15.6221 8.78906 15.3047 8.78906 14.6406V14.3818H6.58691C5.83984 14.3818 5.32227 13.9082 5.32227 13.2246C5.32227 12.8486 5.44922 12.4531 5.72266 11.9648C6.18164 11.1396 6.61621 10.4219 7.1582 9.57227C7.74414 8.64941 8.22266 8.33203 9.02832 8.33203C10.0586 8.33203 10.7422 8.90332 10.7422 9.76758V12.7949H10.9033C11.4453 12.7949 11.7041 13.1318 11.7041 13.5908C11.7041 14.0498 11.4404 14.3818 10.8984 14.3818H10.7422V14.6406C10.7422 15.3047 10.3271 15.6221 9.76562 15.6221ZM8.84766 12.8779V9.83594H8.80859C8.10059 10.8711 7.58789 11.6914 7.0166 12.8193V12.8779H8.84766ZM13.2959 15.5C12.6221 15.5 12.3291 15.124 12.3291 14.6064C12.3291 14.2256 12.5049 13.9326 12.8955 13.6055L14.834 11.9453C15.625 11.2666 15.8496 10.959 15.8496 10.5391C15.8496 10.0947 15.5078 9.78711 15.0049 9.78711C14.6338 9.78711 14.3799 9.95801 14.1162 10.3389C13.8428 10.7393 13.5938 10.8857 13.1982 10.8857C12.6709 10.8857 12.3486 10.5781 12.3486 10.0801C12.3486 9.91895 12.3779 9.76758 12.4414 9.62109C12.8125 8.78125 13.8037 8.25879 15.0342 8.25879C16.748 8.25879 17.8418 9.12305 17.8418 10.4023C17.8418 11.3496 17.3535 11.8428 16.2598 12.79L14.9756 13.8984V13.9375H17.2119C17.7295 13.9375 18.0225 14.2451 18.0225 14.7188C18.0225 15.1826 17.7295 15.5 17.2119 15.5H13.2959Z"
				fill={fillColor}
			/>
		</svg>
	);
}

export default Value;

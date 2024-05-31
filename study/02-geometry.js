import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		/* 다른 method 에서 참조 할 수 있도록 field 화, 다른 메서드에서 참조하기 위함 */
		this._divContainer = divContainer;

		/* antialias : 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현되는 옵션 */
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		/* pixel ratio : 픽셀 밀도 설정 */
		renderer.setPixelRatio(window.devicePixelRatio);
		/* renderer.domElement : canvas 타입의 Dom 객체 */
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		/* 밑줄로 시작하는 field 와 method는 App 클래스 내부에서만 사용된다는 의미로 씀.
		javascript에서는 private 성격을 부여할 수 있는 기능이 없기 때문에 이와 같이 밑줄로 표현하는것이 개발자간의 약속이다) */
		this._setupCamera();
		this._setupLight();
		this._setupModel();
		// * 마우스 컨트롤 추가, 이제 마우스로 요소를 이리저리 회전시킬 수 있음
		this._setupControls();

		/* renderer 나 camera 는 창크기가 변경 될 때 마다 크기에 맞게 속성 값을 재설정해주어야 함 */
		/* resize method를 bind 통해 넘기는 이유 : resize method 안에서 this 가 가르키는 객체가 이벤트 객체가 아닌 App 클래스의 객체가 되도록 하기 위함 */
		window.onresize = this.resize.bind(this);
		/* 생성자에서 무조건 한 번은 호출 : 창크기에 맞게 설정 */
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setupControls() {
		/* new OrbitControls(카메라 객체, 마우스 이벤트를 받는 DOM 요소) */
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		/* 3차원 그래픽을 출력할 영역에 대한 크기를 가져옴 */
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		/* 크기를 이용해서 카메라 객체 생성 */
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		/* 광원의 색상과 광원의 세기 값을 설정 */
		const color = 0xffffff;
		const intensity = 1;
		/* 광원 객체 생성 */
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	/* 선과 면이 있는 정육면체를 생성하는 메서드 */
	_setupModel() {
		/* 형태 : BoxGeometry(가로, 세로, 깊이, 가로 분할 수, 세로 분할 수, 깊이 분할 수)  */
		const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
		// 회색 색상의 재질
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		// mesh 타입의 오브젝트 생성
		const cube = new THREE.Mesh(geometry, fillMaterial);

		// 노란색 선에 대한 재질
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
		// line 타입의 오브젝트 생성, WireframeGeometry는 정육면체의 외곽선이 표시되도록 하게 해줌
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			lineMaterial
		);

		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		this._scene.add(group);
		this._cube = group;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		/* camera 속성 변경 */
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		/* renderer 의 크기 설정 */
		this._renderer.setSize(width, height);
	}

	/* time : requestAnimationFrame 가 render 함수에 전달해주는 값() */
	render() {
		/* renderer 가 scene 을 카메라 시점으로 렌더링하도록 함 */
		this._renderer.render(this._scene, this._camera);

		/* 생성자 코드와 동일 */
		requestAnimationFrame(this.render.bind(this));
	}
}

window.onload = function () {
	new App();
};

declare module 'react-media' {
	export interface MediaQueryObject {
		[id: string]: boolean | number | string;
	}

	export interface MediaProps {
		query: string | MediaQueryObject | MediaQueryObject[];
		defaultMatches?: boolean;
		children?: ((matches: boolean) => React.ReactNode) | React.ReactNode;
		render?: () => React.ReactNode;
	}

	export default class Media extends React.Component<MediaProps, any> {}
}

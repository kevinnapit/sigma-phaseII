<script lang="ts">
	import {
		type CarouselAPI,
		type CarouselProps,
		type EmblaContext,
		setEmblaContext
	} from './context.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		opts = {},
		plugins = [],
		setApi = () => {},
		orientation = 'horizontal',
		class: className,
		children,
		autoplay = false,
		autoplayInterval = 3000,
		pauseOnHover = true,
		...restProps
	}: WithElementRef<CarouselProps> & {
		autoplay?: boolean;
		autoplayInterval?: number;
		pauseOnHover?: boolean;
	} = $props();

	let autoplayTimer: ReturnType<typeof setInterval> | null = null;
	let isPaused = $state(false);

	let carouselState = $state<EmblaContext>({
		api: undefined,
		scrollPrev,
		scrollNext,
		get orientation() { return orientation; },
		canScrollNext: false,
		canScrollPrev: false,
		handleKeyDown,
		get options() { return opts; },
		get plugins() { return plugins; },
		onInit,
		scrollSnaps: [],
		selectedIndex: 0,
		scrollTo
	});

	setEmblaContext(carouselState);

	function scrollPrev() {
		carouselState.api?.scrollPrev();
	}

	function scrollNext() {
		carouselState.api?.scrollNext();
	}

	function scrollTo(index: number, jump?: boolean) {
		carouselState.api?.scrollTo(index, jump);
	}

	function onSelect() {
		if (!carouselState.api) return;
		carouselState.selectedIndex = carouselState.api.selectedScrollSnap();
		carouselState.canScrollNext = carouselState.api.canScrollNext();
		carouselState.canScrollPrev = carouselState.api.canScrollPrev();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			scrollPrev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			scrollNext();
		}
	}

	function startAutoplay() {
		if (!autoplay) return;
		stopAutoplay();
		autoplayTimer = setInterval(() => {
			if (!isPaused && carouselState.api) {
				carouselState.api.scrollNext();
			}
		}, autoplayInterval);
	}

	function stopAutoplay() {
		if (autoplayTimer) {
			clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	}

	function onInit(event: CustomEvent<CarouselAPI>) {
		carouselState.api = event.detail;
		setApi(carouselState.api);

		carouselState.scrollSnaps = carouselState.api.scrollSnapList();
		carouselState.api.on('select', onSelect);
		onSelect();

		startAutoplay();
	}

	$effect(() => {
		return () => {
			carouselState.api?.off('select', onSelect);
			stopAutoplay();
		};
	});
</script>

<div
	bind:this={ref}
	data-slot="carousel"
	class={cn('relative', className)}
	role="region"
	aria-roledescription="carousel"
	onmouseenter={() => {
		if (pauseOnHover) isPaused = true;
	}}
	onmouseleave={() => {
		if (pauseOnHover) isPaused = false;
	}}
	{...restProps}
>
	{@render children?.()}
</div>

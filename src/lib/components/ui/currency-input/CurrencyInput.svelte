<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	interface Props {
		value: number;
		id?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
	}

	let {
		value = $bindable(0),
		id,
		placeholder = 'Rp 0',
		disabled = false,
		required = false,
		class: className = ''
	}: Props = $props();

	let displayValue = $state('');
	let isFocused = $state(false);

	function formatCurrency(num: number): string {
		if (num === 0) return '';
		return new Intl.NumberFormat('id-ID').format(num);
	}

	function parseCurrency(str: string): number {
		const cleaned = str.replace(/[^\d]/g, '');
		return cleaned ? parseInt(cleaned, 10) : 0;
	}

	$effect(() => {
		if (!isFocused) {
			displayValue = formatCurrency(value);
		}
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const inputValue = target.value;
		
		const numericValue = parseCurrency(inputValue);
		value = numericValue;
		
		displayValue = formatCurrency(numericValue);
		
		const cursorPosition = target.selectionStart || 0;
		const oldLength = inputValue.length;
		const newLength = displayValue.length;
		const diff = newLength - oldLength;
		
		setTimeout(() => {
			target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
		}, 0);
	}

	function handleKeyDown(e: KeyboardEvent) {
		const allowedKeys = [
			'Backspace',
			'Delete',
			'ArrowLeft',
			'ArrowRight',
			'Home',
			'End',
			'Tab'
		];

		if (allowedKeys.includes(e.key)) {
			return;
		}

		if (e.ctrlKey || e.metaKey) {
			return;
		}

		if (!/^\d$/.test(e.key)) {
			e.preventDefault();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') || '';
		const numericOnly = pastedText.replace(/[^\d]/g, '');
		
		if (numericOnly) {
			const target = e.target as HTMLInputElement;
			const start = target.selectionStart || 0;
			const end = target.selectionEnd || 0;
			const currentValue = displayValue.replace(/[^\d]/g, '');
			const newValue = currentValue.slice(0, start) + numericOnly + currentValue.slice(end);
			
			value = parseInt(newValue, 10) || 0;
			displayValue = formatCurrency(value);
		}
	}

	function handleFocus() {
		isFocused = true;
		if (value === 0) {
			displayValue = '';
		}
	}

	function handleBlur() {
		isFocused = false;
		displayValue = formatCurrency(value);
	}
</script>

<div class="relative">
	<span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
		Rp
	</span>
	<Input
		{id}
		type="text"
		inputmode="numeric"
		value={displayValue}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		onpaste={handlePaste}
		onfocus={handleFocus}
		onblur={handleBlur}
		{placeholder}
		{disabled}
		{required}
		class="pl-10 {className}"
	/>
</div>

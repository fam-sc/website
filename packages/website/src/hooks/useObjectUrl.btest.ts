import { expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useObjectUrl } from './useObjectUrl';

test('no previous value', () => {
  const { result, act } = renderHook(() => useObjectUrl('123'));

  act(() => {
    result.current[1]({ url: '321', type: undefined });
  });

  act(() => {
    expect(result.current[0]).toEqual('321');
  });
});

test('should revoke previous URL', () => {
  URL.revokeObjectURL = vi.fn();

  const objectUrl = URL.createObjectURL(new Blob());
  const { result, act } = renderHook(() => useObjectUrl(objectUrl, 'object'));

  act(() => {
    result.current[1]({ url: '321', type: undefined });
  });

  act(() => {
    expect(result.current[0]).toEqual('321');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(URL.revokeObjectURL).toHaveBeenCalledOnce();
  });
});

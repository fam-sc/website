import { formatDateOnly } from '@sc-fam/shared/chrono/date.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExportScheduleOptions } from '@/api/schedule/export/options/types';
import { ExportSchedulePayload } from '@/api/schedule/export/types';
import { DatePicker } from '@/components/DatePicker';
import { Labeled } from '@/components/Labeled';
import { TextInput } from '@/components/TextInput';
import {
  TwoPartColor,
  TwoPartColorSelector,
} from '@/components/TwoPartColorSelector';

import styles from './ExportScheduleForm.module.scss';

export interface ExportScheduleFormProps {
  options: ExportScheduleOptions;
  onPayloadChanged: (payload: ExportSchedulePayload) => void;
}

interface ColorWithId extends TwoPartColor {
  id: string;
}

function dateParser(value: string) {
  return () => new Date(value);
}

export function ExportScheduleForm({
  options,
  onPayloadChanged,
}: ExportScheduleFormProps) {
  const colors = useMemo(
    (): ColorWithId[] =>
      Object.entries(options.colors).map(([id, color]) => ({ id, ...color })),
    [options.colors]
  );

  const [title, setTitle] = useState(options.groupName);
  const [colorId, setColorId] = useState(colors[0].id);
  const [startDate, setStartDate] = useState(
    dateParser(options.initialStartDate)
  );
  const [endDate, setEndDate] = useState(dateParser(options.initialStartDate));

  const selectedColor = useMemo(
    () => ({ id: colorId, ...options.colors[colorId] }),
    [options.colors, colorId]
  );

  const onSelectedColor = useCallback(({ id }: { id: string }) => {
    setColorId(id);
  }, []);

  useEffect(() => {
    onPayloadChanged({
      title,
      colorId,
      startDate: formatDateOnly(startDate),
      endDate: formatDateOnly(endDate),
    });
  }, [title, colorId, startDate, endDate, onPayloadChanged]);

  return (
    <div className={styles.root}>
      <Labeled title="Назва">
        <TextInput value={title} onTextChanged={setTitle} />
      </Labeled>

      <Labeled title="Колір">
        <TwoPartColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onSelectedColor={onSelectedColor}
        />
      </Labeled>

      <Labeled title="Початкова дата">
        <DatePicker
          type="date"
          value={startDate}
          onValueChanged={setStartDate}
        />
      </Labeled>

      <Labeled title="Кінцева дата">
        <DatePicker type="date" value={endDate} onValueChanged={setEndDate} />
      </Labeled>
    </div>
  );
}

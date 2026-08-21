import type { TableFormFieldDefinition } from '../../engine/form/field-config';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { TableFormField } from '../../ui/table-form-field';

/** Mounts one field the way a filter form does, exposing its draft as JSON. */
export function renderField(field: TableFormFieldDefinition<any, any>) {
  function Harness() {
    const { control, watch } = useForm<{ value: any }>({
      defaultValues: { value: field.defaultValue },
      mode: 'onChange',
    });

    return (
      <>
        <TableFormField control={control} form={{ value: field }} name="value" />
        <output data-testid="draft">{JSON.stringify(watch('value'))}</output>
      </>
    );
  }

  render(<Harness />);
}

/** Reads the draft the harness last rendered. */
export function draft(): unknown {
  return JSON.parse(screen.getByTestId('draft').textContent ?? 'null');
}

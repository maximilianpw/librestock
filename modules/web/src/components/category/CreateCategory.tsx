'use client'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CategoryForm } from './CategoryForm'
import { Button } from '@/components/ui/button'
import type { CategoryWithChildrenResponseDto } from '@/lib/data/generated'
import { FormDialog } from '@/components/common/FormDialog'

interface CreateCategoryProps {
  categories?: CategoryWithChildrenResponseDto[]
}

export function CreateCategory({
  categories,
}: CreateCategoryProps): React.JSX.Element {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  return (
    <FormDialog
      cancelLabel={t('form.cancel')}
      description={t('form.createCategoryDescription')}
      formId="create-category-form"
      open={open}
      submitLabel={t('form.create')}
      title={t('form.createCategoryTitle')}
      trigger={
        <Button className="rounded-t-none" variant="outline">
          {t('form.createCategoryTitle')}
        </Button>
      }
      onOpenChange={setOpen}
    >
      <CategoryForm categories={categories} onSuccess={() => setOpen(false)} />
    </FormDialog>
  )
}

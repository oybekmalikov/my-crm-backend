export type NotificationTemplateKey =
  | 'payment_overdue'
  | 'payment_reminder'
  | 'attendance_consecutive_absence'
  | 'attendance_low_percentage'
  | 'student_deactivated_overdue'
  | 'lead_follow_up'
  | 'homework_graded'
  | 'level_up'
  | 'lesson_cancelled';

export interface NotificationTemplate {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const NOTIFICATION_TEMPLATES: Record<
  NotificationTemplateKey,
  NotificationTemplate
> = {
  payment_overdue: {
    title: 'To\'lov kechikdi',
    message: '{installmentNumber}-to\'lov ({amount}) muddati o\'tgan ({dueDate}).',
    type: 'warning',
  },
  payment_reminder: {
    title: 'To\'lov eslatmasi',
    message: '{installmentNumber}-to\'lov ({amount}) {dueDate} sanasida to\'lanishi kerak.',
    type: 'info',
  },
  attendance_consecutive_absence: {
    title: 'Davomatsizlik ogohlantirishi',
    message: 'Siz ketma-ket {count} ta darsga qatnashmadingiz.',
    type: 'warning',
  },
  attendance_low_percentage: {
    title: 'Past davomat',
    message: 'Davomatingiz {percentage}% ga tushdi (minimum {threshold}%).',
    type: 'warning',
  },
  student_deactivated_overdue: {
    title: 'Hisob faolsizlashtirildi',
    message: '30 kundan ortiq kechikkan to\'lov tufayli hisobingiz vaqtincha faolsizlashtirildi.',
    type: 'error',
  },
  lead_follow_up: {
    title: 'Lead bilan bog\'lanish kerak',
    message: '{leadName} ({phone}) bilan 7 kundan beri aloqa qilinmagan.',
    type: 'info',
  },
  homework_graded: {
    title: 'Uy vazifasi baholandi',
    message: 'Uy vazifangiz {mark} ball bilan baholandi.',
    type: 'success',
  },
  level_up: {
    title: 'Yangi daraja!',
    message: 'Tabriklaymiz! Siz {level}-darajaga ko\'tarildingiz.',
    type: 'success',
  },
  lesson_cancelled: {
    title: 'Dars bekor qilindi',
    message: '{lessonTitle} ({date}) darsi bekor qilindi. Sabab: {reason}',
    type: 'warning',
  },
};

export function renderNotificationTemplate(
  key: NotificationTemplateKey,
  vars: Record<string, string | number>,
): NotificationTemplate {
  const template = NOTIFICATION_TEMPLATES[key];
  let title = template.title;
  let message = template.message;
  for (const [k, v] of Object.entries(vars)) {
    title = title.replace(`{${k}}`, String(v));
    message = message.replace(`{${k}}`, String(v));
  }
  return { title, message, type: template.type };
}

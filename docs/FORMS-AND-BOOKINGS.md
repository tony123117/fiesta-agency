# FORMS-AND-BOOKINGS.md — Fiesta Agency

## Contact Form

The contact form on the `/contact` page performs dual-save:

1. **Web3Forms** — Sends form data as email delivery
2. **Supabase** — Saves to `bookings` table as record

---

## Form Fields

| Field | Type | Required |
|-------|------|----------|
| `client_name` | text | Yes |
| `email` | email | Yes |
| `phone` | text | No |
| `event_type` | select | Yes |
| `event_date` | date | No |
| `location` | text | No |
| `guest_count` | number | No |
| `budget` | select | No |
| `message` | textarea | No |
| `referral` | select | No |

---

## Validation

- Client-side validation via HTML5 form attributes
- Required fields enforced
- Email format validated
- Event type selection required

---

## Submission Flow

```
1. Visitor fills form
2. Client-side validation
3. POST to Web3Forms API → email sent
4. Fire-and-forget insert into Supabase bookings table
5. Success/error toast shown to visitor
6. Form reset on success
```

---

## Booking Statuses

| Status | Description |
|--------|-------------|
| `new` | Initial submission |
| `contacted` | Admin has contacted client |
| `in_progress` | Event planning underway |
| `confirmed` | Event confirmed |
| `completed` | Event finished |
| `cancelled` | Event cancelled |

---

## Admin Management

Bookings are managed at `/admin/bookings`:
- List with search and filter by status
- View booking details
- Update status
- Add internal notes
- See submission date

---

## See Also

- [PUBLIC-PAGES.md](./PUBLIC-PAGES.md)
- [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md)

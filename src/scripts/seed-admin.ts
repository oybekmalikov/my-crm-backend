/**
 * One-time bootstrap script: creates the first SUPERADMIN user directly in
 * the database, bypassing the (intentionally admin-only) `/users` API.
 *
 * There is no self-serve sign-up endpoint by design — every user is created
 * by an existing admin. That means the very first account can't come from
 * the API, so it must be seeded here instead.
 *
 * Usage:
 *   npm run seed:admin -- --login=admin --password='Str0ng!Pass' --phone=+998901234567 \
 *     [--firstName=Super] [--lastName=Admin] [--middleName=Admin]
 *
 * Refuses to run if a user with the given login already exists, or if no
 * password is supplied. Safe to re-run with a different login to create
 * additional admins later (though prefer the authenticated API for that
 * once at least one SUPERADMIN exists).
 */
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserSchema } from '../users/entities/user.entity';

function parseArgs(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = /^--([^=]+)=(.*)$/.exec(arg);
    if (match) {
      out[match[1]] = match[2];
    }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const login = args.login;
  const password = args.password;
  const phone = args.phone;
  const firstName = args.firstName || 'Super';
  const lastName = args.lastName || 'Admin';
  const middleName = args.middleName || 'Admin';

  if (!login || !password || !phone) {
    console.error(
      'Usage: npm run seed:admin -- --login=<login> --password=<strong password> --phone=<+998XXXXXXXXX>',
    );
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const UserModel = mongoose.model('User', UserSchema, 'users');

  try {
    const existing = await UserModel.findOne({ login }).exec();
    if (existing) {
      console.error(`A user with login "${login}" already exists.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const user = await UserModel.create({
      firstName,
      lastName,
      middleName,
      login,
      password: hashedPassword,
      phone,
      role: 'SUPERADMIN',
    });

    console.log(`SUPERADMIN user created: login="${login}", id=${user._id}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

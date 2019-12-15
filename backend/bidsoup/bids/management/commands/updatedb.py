from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.conf import settings
import os
import psycopg2
from psycopg2 import sql

class Command(BaseCommand):
    help = 'Resets the database to a known state. Useful for development.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            dest='reset',
            help='Reset the database (drops all tables) before migrating',
        )

    def handle(self, *args, **options):
        admin_needs_migrate = False
        if options['reset']:
            if settings.DEBUG or self.check_prod_allow():
                # Migrate back admin because it has a dependency on the User model.
                call_command('migrate', 'admin', 'zero')
                admin_needs_migrate = True

                passwd = os.environ['POSTGRES_PASSWORD']
                with psycopg2.connect(dbname='postgres', user='postgres', password=passwd, host='db') as conn:
                    tables = []
                    with conn.cursor() as curs:
                        curs.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'bids%'")
                        for t in curs.fetchall():
                            tables.append(t[0])

                    with conn.cursor() as curs:
                        for t in tables:
                            command = sql.SQL('DROP TABLE {} CASCADE').format(sql.Identifier(t))
                            self.stdout.write('Running command: %s' % command.as_string(curs))
                            curs.execute(command)

                conn.close()
                self.stdout.write('All bid tables dropped. Now performing all migrations.')
                call_command('migrate', 'bids', 'zero', fake=True)
            else:
                self.stdout.write('DEBUG is False!\nDatabase cannot be reset in production!')

        else:
            self.stdout.write('Performing migrations only.')

        call_command('migrate', 'bids')
        if admin_needs_migrate:
            # Migrate back admin
            call_command('migrate', 'admin')

    def check_prod_allow(self):
        dbpass = input('Enter database password to reset: ')
        if dbpass == os.environ['POSTGRES_PASSWORD']:
            return True
        else:
            print('Incorrect password. Data will not be deleted.')
            return False

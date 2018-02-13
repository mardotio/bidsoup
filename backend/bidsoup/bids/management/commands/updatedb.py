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
        if settings.DEBUG:
            if options['reset']:
                passwd = os.environ['POSTGRES_PASSWORD']
                with psycopg2.connect(dbname='postgres', user='postgres', password=passwd, host='db') as conn:
                    tables = []
                    with conn.cursor() as curs:
                        curs.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
                        for t in curs.fetchall():
                            tables.append(t[0])

                    with conn.cursor() as curs:
                        for t in tables:
                            command = sql.SQL('DROP TABLE {} CASCADE').format(sql.Identifier(t))
                            self.stdout.write('Running command: %s' % command.as_string(curs))
                            curs.execute(command)

                conn.close()
                self.stdout.write('All tables dropped. Now performing all migrations.')
            else:
                self.stdout.write('Performing migrations only.')

            call_command('migrate')
        else:
            self.stdout.write('DEBUG is False!')
            self.stdout.write('Database cannot be reset in production!')

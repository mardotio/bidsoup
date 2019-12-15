import rules
from rules.predicates import always_allow, always_deny
from .models import Account, User

@rules.predicate
def has_account(user):
    return user.accounts != []

@rules.predicate
def on_account(user, account):
    return account in user.accounts.all()

@rules.predicate
def can_edit_bid(user, bid):
    return bid.account in user.accounts.all()

@rules.predicate
def can_edit_bid_item(user, bid_item):
    return can_edit_bid(user, bid_item.bid)

@rules.predicate
def can_edit_bid_task(user, bid_task):
    return bid_task.bid.account in user.accounts.all()

@rules.predicate
def can_edit_category(user, category):
    return category.account in user.accounts.all()

@rules.predicate
def can_edit_customer(user, customer):
    return customer.account in user.accounts.all()

@rules.predicate
def can_edit_unittype(user, unittype):
    return can_edit_category(user, unittype.category)

@rules.predicate
def can_edit_user(user, u):
    #TODO: Add some type of permission for account owners
    return user == u

@rules.predicate
def can_invite(user, account):
    account_user = account.accountuser_set.filter(user=user).first()
    return account_user != None and account_user.access_level in ['MANAGER', 'OWNER']


rules.add_perm('bids.view_accounts', always_allow)
rules.add_perm('bids.on_account', on_account)
rules.add_perm('bids.view_bids', has_account)
rules.add_perm('bids.owns_bid', can_edit_bid)
rules.add_perm('bids.view_bid_items', has_account)
rules.add_perm('bids.owns_bid_item', can_edit_bid_item)
rules.add_perm('bids.view_bid_tasks', has_account)
rules.add_perm('bids.owns_bid_task', can_edit_bid_task)
rules.add_perm('bids.view_categories', has_account)
rules.add_perm('bids.owns_category', can_edit_category)
rules.add_perm('bids.view_customers', has_account)
rules.add_perm('bids.has_customer', can_edit_customer)
rules.add_perm('bids.view_unittypes', has_account)
rules.add_perm('bids.owns_unittype', can_edit_unittype)
rules.add_perm('bids.view_users', has_account)
rules.add_perm('bids.edit_user', can_edit_user)
rules.add_perm('bids.invite_to_account', can_invite)

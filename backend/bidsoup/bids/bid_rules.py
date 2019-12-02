import rules
from rules.predicates import always_allow, always_deny
from .models import Account, User

@rules.predicate
def has_account(user):
    return user.account is not None

@rules.predicate
def on_account(user, account):
    return user.account == account

@rules.predicate
def can_edit_bid(user, bid):
    return bid in user.account.bid_set.all()

@rules.predicate
def can_edit_bid_item(user, bid_item):
    return can_edit_bid(user, bid_item.bid)

@rules.predicate
def can_edit_bid_task(user, bid_task):
    return bid_task.bid in user.account.bid_set.all()

@rules.predicate
def can_edit_category(user, category):
    return category.account == user.account

@rules.predicate
def can_edit_customer(user, customer):
    return customer.account == user.account

@rules.predicate
def can_edit_unittype(user, unittype):
    return can_edit_category(user, unittype.category)

@rules.predicate
def can_edit_user(user, u):
    #TODO: Add some type of permission for account owners
    return user == u

@rules.predicate
def can_invite(user, account):
    # TODO: ensure user can edit the account
    user.account == account
    print('user: ', user)
    print('account: ', account)
    return True


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
rules.add_perm('bids.view_users', always_allow)
rules.add_perm('bids.edit_user', can_edit_user)
rules.add_perm('bids.invite_to_account', can_invite)
